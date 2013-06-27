var gameType = "Multiplayer Testing";
var gameName = "Multiplayer Testing";
var MasterIp : String;
var RemotePort : int;
var isMasterServer : boolean;

var btnX:float;
var btnY:float;
var btnW:float;
var btnH:float;

var stringId : String;
public static var MasterServerClicked : boolean;

function Start () {
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
	MasterServerClicked = false;
}

function OnGUI () {
	if(MasterServerClicked){
		
		gameName = GUI.TextField(Rect(btnX, btnY, btnW, btnH),gameName);
		
		if(GUI.Button(Rect(btnX + btnW * 1.04, btnY, btnW, btnH), "Add Host")){
			if(isMasterServer){
				Debug.Log("Adding a host");
				registerServer();
				addHost();
			} else {
				Debug.Log("Not eligible to add host");
			}
		}
		
		stringId = GUI.TextField(Rect(btnX, btnY * 7, btnW, btnH),stringId);
		
		if(GUI.Button(Rect(btnX + btnW * 1.04, btnY * 7, btnW, btnH), "Delete Host")){
			if(isMasterServer){
				Debug.Log("Deleting a host");
				deleteHost(int.Parse(stringId));
			} else {
				Debug.Log("Not eligible to delete host");
			}
		}
		
		if(GUI.Button(Rect(btnX, btnY * 13, btnW, btnH), "Return")){
			Debug.Log("Returning to main menu");
			MasterServerClicked = false;
			Application.LoadLevel(0);
		}
	}
}

function Update () {
	
}

function OnMasterServerEvent(mse:MasterServerEvent){
	if(mse == MasterServerEvent.RegistrationSucceeded){
		Debug.Log("Registered Server!");
	}
}

function registerServer () {
	Network.InitializeServer(32,RemotePort,!Network.HavePublicAddress); 
}

function addHost() {
	MasterServer.RegisterHost(gameType, gameName, "This is a test");
	for (var go : GameObject in FindObjectsOfType(GameObject)){
	 	go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
	}
}

function deleteHost(Id : int) {
	
}

function OnApplicationQuit(){
	if(isMasterServer){
		MasterServer.UnregisterHost();
		Network.Disconnect();
	}
}