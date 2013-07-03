var gameType = "Multiplayer Testing";
var gameName = "Multiplayer Testing";

var refreshing:boolean;
var hostData:HostData[];

var btnX:float;
var btnY:float;
var btnW:float;
var btnH:float;

var MasterIp : String;
var RemotePort : int;
var isMasterServer : boolean;

var startServer : boolean;
var refreshHost : boolean;

var admin : AdminSpawnControl;
var master : MasterNetWork;

static var newLog = new Array();
var oldInput : String;
var newInput : String;
var pending : boolean;
var requestSent : boolean;
var RPCReady : boolean;

function Start() {
	btnX = Screen.width * 0.01;
	btnY = Screen.width * 0.01;
	btnW = Screen.width * 0.3;
	btnH = Screen.width * 0.05;
	
//	MasterIp = "192.168.0.100";
//	MasterIp = "172.20.1.229";
	RemotePort = 25003;
	if(Network.player.ipAddress == MasterIp){
		isMasterServer = true;
	} else {
		isMasterServer = false;
	}
	
	isMasterServer = true;
	startServer = false;
	refreshHost = false;
	oldInput = "";
	newInput = "";
	pending = false;
	requestSent = false;
	RPCReady = false;
}

function refreshHostList(){
	MasterServer.ClearHostList();
	MasterServer.RequestHostList(gameType);
	refreshing = true;
}

function connectMasterHost(){
	MasterServer.ClearHostList();
	MasterServer.RequestHostList(gameType);
	refreshing = true;
}

function Update(){
	if(refreshing){
		if(MasterServer.PollHostList().Length > 0){
			refreshing = false;
			hostData = MasterServer.PollHostList();
		}
	}
	
	if((Network.isClient || Network.isServer) && pending){
		pending = false;
		Debug.Log("Pending: " + pending);
		Debug.Log("RPCReady: " + RPCReady);
		Debug.Log("isClient: " + Network.isClient);
		Debug.Log("isServer: " + Network.isServer);
	}
}

function OnGUI() {
	if(!master.MasterServerClicked){
		if(!Network.isClient && !Network.isServer){
		
			newInput = GUI.TextField(Rect(btnX, btnY, btnW, btnH),newInput);
		
			if(GUI.Button(Rect(btnX + btnW * 1.04, btnY, btnW, btnH), "Start Server")){
				if((!newInput.Equals(oldInput)) && (!newInput.Equals(""))){
					Debug.Log("oldInput: " + oldInput);
					Debug.Log("newInput: " + newInput);
					Debug.Log("Sending remote server request");
					connectMasterHost();
					startServer = true;
				}
			}
			
//			gameName = GUI.TextField(Rect(btnX, btnY * 7, btnW, btnH),gameName);
			
//			if(GUI.Button(Rect(btnX + btnW * 1.04, btnY * 7, btnW, btnH), "Search Hosts")){
//				Debug.Log("Refreshing");
//				refreshHostList();
//				refreshHost = true;
//			}
			
			if(GUI.Button(Rect(btnX, btnY * 7, btnW, btnH), "Refresh Hosts")){
				Debug.Log("Refreshing");
				refreshHostList();
				refreshHost = true;
			}
			
			if(isMasterServer){
				if(GUI.Button(Rect(btnX, btnY * 13, btnW, btnH), "Master Server")){
					Debug.Log("Disable camera");
//					Application.LoadLevel("MasterServer");
					GameObject.Find("Main Camera").camera.enabled = false;
					master.MasterServerClicked = true;
					StartMasterServer();
				}
			}
			
			if(hostData && refreshHost && !pending){
				for(var i = 0; i < hostData.length; i++){
					if(GUI.Button(Rect(btnX + btnW * 1.04, btnY + btnH + (btnH * i * 1.2), btnW, btnH),hostData[i].gameName)){
						Network.Connect(hostData[i]);
						pending = true;
						for (var go : GameObject in FindObjectsOfType(GameObject)){
		 	 				go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
						}
						
					}
				}
			}
			
			if(hostData && startServer && !pending){
				Debug.Log("Hostdata exists");
				for(var j = 0; j < hostData.length; j++){
					if(hostData[j].gameName == "Multiplayer Testing" && !Network.isClient){
						Network.Connect(hostData[j]);
						pending = true;
						RPCReady = true;
					}
				}
			}
		}
		
		if(!pending && RPCReady && !newInput.Equals(oldInput)){
			Debug.Log("Pending: " + pending);
			networkView.RPC("sendRequest",RPCMode.All);
			Debug.Log("Request sent to master server");
		}
		
		if(GUI.Button(Rect(Screen.width - btnW * 1.04, Screen.height - btnH * 1.2, btnW, btnH), "Restart")){	
			admin.DestroyPlayerInNetwork();
			admin.selected = false;
			pending = false;
			startServer = false;
			MasterServer.UnregisterHost();
			Network.Disconnect();		
	     	Application.LoadLevel("Scene1");
	    }
	}
}


function OnConnectedToServer() {
	for (var go : GameObject in FindObjectsOfType(GameObject))
	go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);		
}

function StartMasterServer() {
	Network.InitializeServer(32,25002,!Network.HavePublicAddress); 
	MasterServer.RegisterHost(gameType, "Master server", "This is a test");
}

@RPC
function sendRequest() {
	newLog.Push(newInput);
	oldInput = newInput;
	requestSent = true;
}