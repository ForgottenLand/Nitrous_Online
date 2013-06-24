var gameName = "Multiplayer Testing";

private var refreshing:boolean;
private var hostData:HostData[];

private var btnX:float;
private var btnY:float;
private var btnW:float;
private var btnH:float;

private var MasterIp : String;
private var RemotePort : int;
private var isMasterServer : boolean;

var admin : AdminSpawnControl;
private var connected : boolean;

private var startServer : boolean;
private var refreshServer : boolean;

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
	
	connected = false;
	startServer = false;
	refreshServer = false;
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
		}
		
		if(GUI.Button(Rect(btnX, btnY * 7, btnW, btnH), "Refresh Hosts")){
			Debug.Log("Refreshing");
			refreshHostList();
		}
		
		if(isMasterServer){
			if(GUI.Button(Rect(btnX, btnY * 13, btnW, btnH), "Master Server")){
				Debug.Log("Loading master server scene");
				Application.LoadLevel(1);
			}
		}
		
		if(hostData && refreshServer){
			for(var i = 0; i < hostData.length; i++){
				if(GUI.Button(Rect(btnX  * 2 + btnW, btnY + (btnH*i), btnW * 4, btnH * 0.5),hostData[i].gameName)){
					Network.Connect(hostData[i]);
					for (var go : GameObject in FindObjectsOfType(GameObject)){
	 	 				go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
					}
					System.Threading.Thread.Sleep(3000);
				}
			}
		}
		
		if(hostData && startServer){
			Network.Connect(hostData[0]);
			for (var go : GameObject in FindObjectsOfType(GameObject)){
 				go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
			}
			System.Threading.Thread.Sleep(3000);
		}
	}
	
	if(GUI.Button(Rect(Screen.width - btnW, Screen.height - btnH, btnW, btnH), "Restart")){
		Application.LoadLevel(0);
		Network.Disconnect();
		MasterServer.ClearHostList();
		MasterServer.UnregisterHost();
     	admin = this.GetComponent(AdminSpawnControl);
     	admin.selected = false;	
     }
}

function OnConnectedToServer() {
	for (var go : GameObject in FindObjectsOfType(GameObject))
	go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);		
}
 

@RPC
function ExitCL(){
  	Application.Quit();
}