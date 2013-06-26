var gameName = "Multiplayer Testing";
var counter : int;
var MasterIp : String;
var RemotePort : int;
var isMasterServer : boolean;

var btnX:float;
var btnY:float;
var btnW:float;
var btnH:float;

var stringId : String;

function Start () {
	btnX = Screen.width * 0.01;
	btnY = Screen.width * 0.01;
	btnW = Screen.width * 0.3;
	btnH = Screen.width * 0.05;
	
//	MasterIp = "192.168.0.100";
	MasterIp = "172.20.1.229";
	RemotePort = 25002;
	if(Network.player.ipAddress == MasterIp){
		isMasterServer = true;
	} else {
		isMasterServer = false;
	}
	
	isMasterServer = true;
	counter = 0;
}

function OnGUI () {
	if(GUI.Button(Rect(btnX, btnY, btnW, btnH), "Start Master Server")){
		if(isMasterServer){
			Debug.Log("Starting master server");
			registerServer();
			registerMasterHost();
		} else {
			Debug.Log("Not eligible to initialize master server");
		}
	}
	
	if(GUI.Button(Rect(btnX, btnY * 7, btnW, btnH), "Add Host")){
		if(isMasterServer){
			Debug.Log("Adding a host");
			registerServer();
			addHost();
		} else {
			Debug.Log("Not eligible to add host");
		}
	}
	
	stringId = GUI.TextField(Rect(btnX, btnY * 13, btnW, btnH),stringId);
	
	if(GUI.Button(Rect(btnX + btnW * 1.04, btnY * 13, btnW, btnH), "Delete Host")){
		if(isMasterServer){
			Debug.Log("Deleting a host");
			deleteHost(int.Parse(stringId));
		} else {
			Debug.Log("Not eligible to delete host");
		}
	}
	
	if(GUI.Button(Rect(btnX, btnY * 19, btnW, btnH), "Return")){
		Debug.Log("Returning to scene1");
		Application.LoadLevel(0);
	}
}

function Update () {
	
}

function registerServer () {
	Network.InitializeServer(32,RemotePort,!Network.HavePublicAddress);
}

function registerMasterHost () {
	MasterServer.RegisterHost(gameName,"John's Master Host", "This is a test");
	for (var go : GameObject in FindObjectsOfType(GameObject)){
	 	go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
	}
}

function addHost() {
	MasterServer.RegisterHost(gameName,"Client's Host @ " + Network.player.ipAddress + " Id: " + counter, "This is a test");
	for (var go : GameObject in FindObjectsOfType(GameObject)){
	 	go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
	}
	counter++;
}

function deleteHost(Id : int) {
	
}

function OnApplicationQuit(){
	if(isMasterServer){
		MasterServer.UnregisterHost();
		Network.Disconnect();
	}
}