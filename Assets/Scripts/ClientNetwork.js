var gameType = "Multiplayer Testing";
var gameName = "Multiplayer Testing";

var refreshing:boolean;
var hostData:HostData[];

var btnX:float;
var btnY:float;
var btnW:float;
var btnH:float;

var MasterIp1 : String;
var MasterIp2 : String;
var RemotePort : int;
var MasterPort : int;
var isAministrator : boolean;

var startServer : boolean;
var refreshHost : boolean;

var admin : AdminSpawnControl;
var adminPanel : AdminPanel;

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
	
	MasterIp1 = "192.168.0.100";
	MasterIp2 = "172.20.1.229";
	RemotePort = 25003;
	MasterPort = 26003;
	if(Network.player.ipAddress == MasterIp1 || Network.player.ipAddress == MasterIp2){
		isAministrator = true;
	} else {
		isAministrator = false;
	}
	
	isAministrator = true;
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
	if(!adminPanel.adminPanelClicked){
		if(!Network.isClient && !Network.isServer){
			
			if(GUI.Button(Rect(btnX, btnY * 1, btnW, btnH), "Start Game")){
				Debug.Log("Sending remote server request");
				connectMasterHost();
				startServer = true;
			}
			
			if(isAministrator){
				if(GUI.Button(Rect(btnX, btnY * 7, btnW, btnH), "Admin Panel")){
					Debug.Log("Disable camera");
					GameObject.Find("Main Camera").camera.enabled = false;
					adminPanel.adminPanelClicked = true;
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
					if(hostData[j].gameName == "Master Server" && !Network.isClient){
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

@RPC
function sendRequest() {
	newLog.Push(newInput);
	oldInput = newInput;
	requestSent = true;
}