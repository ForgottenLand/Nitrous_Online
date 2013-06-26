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

var adminObj : GameObject;
var admin : AdminSpawnControl;

function Start() {
	btnX = Screen.width * 0.01;
	btnY = Screen.width * 0.01;
	btnW = Screen.width * 0.1;
	btnH = Screen.width * 0.05;
	
	MasterIp = "192.168.0.100";
	RemotePort = 25002;
	if(Network.player.ipAddress == MasterIp){
		isMasterServer = true;
	} else {
		isMasterServer = false;
	}
	
	startServer = false;
	refreshHost = false;
	
	admin = adminObj.GetComponent(AdminSpawnControl);
}

function refreshHostList(){
	MasterServer.RequestHostList(gameName);
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

function OnMasterServerEvent(mse:MasterServerEvent){
	if(mse == MasterServerEvent.RegistrationSucceeded){
		Debug.Log("Registered Server!");
	}
}

function OnGUI() {
	if(!Network.isClient && !Network.isServer){
	
		if(GUI.Button(Rect(btnX, btnY, btnW, btnH), "Start Server")){
			Debug.Log("Sending remote server request");
			refreshHostList();
			startServer = true;
		}
		
		if(GUI.Button(Rect(btnX, btnY * 7, btnW, btnH), "Refresh Hosts")){
			Debug.Log("Refreshing");
			refreshHostList();
			refreshHost = true;
		}
		
		if(isMasterServer){
			if(GUI.Button(Rect(btnX, btnY * 13, btnW, btnH), "Master Server")){
				Debug.Log("Loading master server scene");
				Application.LoadLevel(1);
			}
		}
		
		if(hostData && refreshHost){
			for(var i = 0; i < hostData.length; i++){
				if(GUI.Button(Rect(btnX  * 2 + btnW, btnY + (btnH*i), btnW * 4, btnH * 0.5),hostData[i].gameName)){
					Network.Connect(hostData[i]);
					for (var go : GameObject in FindObjectsOfType(GameObject)){
	 	 				go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
					}
					
				}
			}
		}
		
		if(hostData && startServer){
			for(var j = 0; j < hostData.length; j++){
				if(GUI.Button(Rect(btnX  * 2 + btnW, btnY + (btnH*i), btnW * 4, btnH * 0.5),hostData[j].gameName)){
					Network.Connect(hostData[j]);
					for (var go : GameObject in FindObjectsOfType(GameObject)){
	 	 				go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
					}
					
				}
			}
		}
	}
	
	if(GUI.Button(Rect(Screen.width - btnW, Screen.height - btnH, btnW, btnH), "Restart")){
		Application.LoadLevel(0);
		MasterServer.UnregisterHost();
		Network.Disconnect();
		admin.OnApplicationQuit();
     }
}

function OnConnectedToServer() {
	for (var go : GameObject in FindObjectsOfType(GameObject))
	go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);		
}