var gameType;
var gameName;

var refreshing = false;
var hostData:HostData[];

var btnX:float;
var btnY:float;
var btnW:float;
var btnH:float;

var MasterIp1 : String;
var MasterIp2 : String;
var RemotePort : int;
var MasterPort : int;
var isAministrator = false;

var startServer : boolean;
var refreshHost = false;

var admin : AdminSpawnControl;
var adminPanel : AdminPanel;

static var newLog = new Array();
var oldInput = "";
var newInput = "";
var pending = false;
var requestSent = false;
var RPCReady = false;

function Start() {
	btnX = adminPanel.btnX;
	btnY = adminPanel.btnY;
	btnW = adminPanel.btnW;
	btnH = adminPanel.btnH;
	
	gameType = adminPanel.gameType;
	gameName = adminPanel.gameName;
	
	MasterIp1 = adminPanel.MasterIp1;
	MasterIp2 = adminPanel.MasterIp2;
	
	RemotePort = adminPanel.RemotePort;
	MasterPort = adminPanel.MasterPort;
	
	if(Network.player.ipAddress.ToString().Contains(MasterIp1) || Network.player.ipAddress.ToString().Contains(MasterIp2)){
		isAministrator = true;
	}
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