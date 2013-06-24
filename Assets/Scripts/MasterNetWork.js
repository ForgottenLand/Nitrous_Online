var gameName = "Multiplayer Testing";
var counter : int;
private var MasterIp : String;
private var RemotePort : int;
private var isMasterServer : boolean;

private var btnX:float;
private var btnY:float;
private var btnW:float;
private var btnH:float;

function Start () {
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
	counter = 0;
}

function OnGUI () {
	if(GUI.Button(Rect(btnX, btnY * 13, btnW * 3, btnH), "Start Master Server")){
		if(isMasterServer){
			Debug.Log("Starting master server");
			registerServer();
		} else {
			Debug.Log("Not eligible to initialize master server");
		}
	}
}

function Update () {
	
}

function registerServer () {
	Network.InitializeServer(32,RemotePort,!Network.HavePublicAddress);
}

function addHost() {
	MasterServer.RegisterHost(gameName,"Multiplayer Testing @ " + Network.player.ipAddress + " Counter: " + counter, "This is a test");
	for (var go : GameObject in FindObjectsOfType(GameObject)){
	 	go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
	}
	counter ++;
}

function deleteHost() {

}