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
	if(GUI.Button(Rect(btnX, btnY, btnW * 3, btnH), "Start Master Server")){
		if(isMasterServer){
			Debug.Log("Starting master server");
			registerServer();
			registerMasterHost();
		} else {
			Debug.Log("Not eligible to initialize master server");
		}
	}
	
	if(GUI.Button(Rect(btnX, btnY * 7, btnW, btnH), "Return")){
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

function deleteHost() {

}