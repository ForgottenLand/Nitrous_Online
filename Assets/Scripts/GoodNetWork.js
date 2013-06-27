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
}

function refreshHostList(){
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
}

function OnGUI() {
	if(!master.MasterServerClicked){
		if(!Network.isClient && !Network.isServer){
		
			if(GUI.Button(Rect(btnX, btnY, btnW, btnH), "Start Server")){
				Debug.Log("Sending remote server request");
				refreshHostList();
				startServer = true;
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
				}
			}
			
			if(hostData && refreshHost){
				for(var i = 0; i < hostData.length; i++){
					if(GUI.Button(Rect(btnX + btnW * 1.04, btnY + (btnH * i * 1.2), btnW, btnH),hostData[i].gameName)){
						Network.Connect(hostData[i]);
						for (var go : GameObject in FindObjectsOfType(GameObject)){
		 	 				go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
						}
						
					}
				}
			}
			
			if(hostData && startServer){
				for(var j = 0; j < hostData.length; j++){
					if(GUI.Button(Rect(btnX + btnW * 1.04, btnY + (btnH * j * 1.2), btnW, btnH),hostData[j].gameName)){
						Network.Connect(hostData[j]);
						for (var go : GameObject in FindObjectsOfType(GameObject)){
		 	 				go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
						}
						
					}
				}
			}
		}
		
		if(GUI.Button(Rect(Screen.width - btnW * 1.04, Screen.height - btnH * 1.2, btnW, btnH), "Restart")){	
			admin.DestroyPlayerInNetwork();
			admin.selected = false;
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