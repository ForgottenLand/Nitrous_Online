public static var gameType = "Nitrous Online";
public static var gameName = "Interview Demo";
public static var adminPanelClicked = false;
public static var masterServerCreated = false;
public static var MasterIp1 = "192.168.0.13";
public static var RemotePort = 25003;
public static var MasterPort = 26000;

var btnX : float;
var btnY : float;
var btnW : float;
var btnH : float;

var stringId : String;

var client : ClientNetwork;

var oldLog = new Array();
var newLog = new Array();

var buttonSize = 4;

var playerAmt = 0;
var state = "empty";
var timer = 30;
public static var broadcastPlayerAmt = 0;
public static var broadcastState = "empty";
public static var broadcastTimer = 30;

function Start () {
	btnX = Screen.width * 0.01;
    btnY = Screen.width * 0.01;
    btnW = Screen.width * 0.3;
    btnH = Screen.width * 0.05;
}

function OnGUI () {
	if(!masterServerCreated){
		if(adminPanelClicked){
			gameName = GUI.TextField(Rect(btnX, btnY, btnW, btnH),gameName);
			RemotePort = int.Parse(GUI.TextField(Rect(btnX + btnW * 1.04, btnY, btnW, btnH),RemotePort.ToString()));
			
			if(GUI.Button(Rect(btnX + btnW * 2.08, btnY, btnW, btnH), "Add Host")){
				AddHost();
			}
			
			stringId = GUI.TextField(Rect(btnX, btnY * 7, btnW, btnH),stringId);
			
			if(GUI.Button(Rect(btnX + btnW * 1.04, btnY * 7, btnW, btnH), "Delete Host")){
				Debug.Log("Deleting a host");
				DeleteHost(int.Parse(stringId));
			}
			
			if(GUI.Button(Rect(btnX, btnY * 13, btnW, btnH), "Master Server")){
				createMasterServer();
				masterServerCreated = true;
			}
			
			if(GUI.Button(Rect(btnX, btnY * 19, btnW, btnH), "Return")){
				Debug.Log("Returning to main menu");
				adminPanelClicked = false;
				Application.LoadLevel(0);
			}
		}
	}
}

function AddHost () {
	try{
		Network.InitializeServer(32,RemotePort,!Network.HavePublicAddress); 
		MasterServer.RegisterHost(gameType, gameName, "This is a test");
		for (var go : GameObject in FindObjectsOfType(GameObject)){
	 		go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
		}
		Debug.Log("Server is initialized");
	}
	catch(UnityException){
		Debug.Log("Port is already in used, please select a different one");
	}
}

function Update () {
	newLog = client.newLog;
	if(newLog.length != oldLog.length){
		Debug.Log("Receive new request!");
//		RunAutoIt();
		Debug.Log(oldLog.length);
		Debug.Log(newLog.length);
		oldLog = newLog;
	}
	
	if(playerAmt >= 2) {
		state = "countdown";
	}
	
	if(playerAmt == 1) {
		state = "waiting";
	}
	
	if(playerAmt == 0) {
		state = "empty";
	}
	
	if(state.Equals("countdown")) {
		timer -= Time.deltaTime;
	}
	
	if(state.Equals("countdown") && timer <= 0) {
		state = "ready";
	}
	
	if(state.Equals("ready")){
		timer = 30;	
	}
	
	Broadcast();
}

function OnPlayerConnected(networkPlayer:NetworkPlayer):void
{
	 Debug.Log (networkPlayer.guid + " connected");
	 playerAmt++;
}

function DeleteHost (Id : int) {
	
}

function OnMasterServerEvent(mse:MasterServerEvent){
	if(mse == MasterServerEvent.RegistrationSucceeded){
		Debug.Log("Registered Server!");
	}
}

function OnApplicationQuit(){
	MasterServer.UnregisterHost();
	Network.Disconnect();
}

function createMasterServer(){
	Network.InitializeServer(32,MasterPort,!Network.HavePublicAddress); 
	MasterServer.RegisterHost(gameType, "Master Server", "This is a test");	
}

function RunAutoIt(){
	if(Application.platform == RuntimePlatform.WindowsEditor){
		var fileLocation = "";
		if(Network.player.ipAddress == "192.168.0.13")
			fileLocation = "C:/MultiplayerProject/Assets/Scripts/IdeaPad.au3";

		System.Diagnostics.Process.Start(fileLocation);
		Debug.Log("Started: " + fileLocation);
	}
}

@RPC
function Broadcast() {
	broadcastPlayerAmt = playerAmt;
	broadcastState = state;
	broadcastTimer = timer;
}