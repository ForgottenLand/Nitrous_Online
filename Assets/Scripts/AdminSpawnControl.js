//The car transforms
var avatar0 : Transform;
var avatar1 : Transform;
var avatar2 : Transform;
var avatar3 : Transform;
var avatar4 : Transform;

//the button dimensions
private var btnX:float;
private var btnY:float;
private var btnW:float;
private var btnH:float;

//Which car and whether you've picked it yet.
public var selectNumber : int;
var selected : boolean;

//The Player GameObject and its name
public static var Player : GameObject;
var playerClone: String;

var style:GUIStyle;

//Luke Variables---------------
var frLeft : WheelCollider;
var frRight : WheelCollider; 
var reLeft : WheelCollider; 
var reRight : WheelCollider;

var speed: float;
var impulse: float;

var LCar : LukeCar;

var enginePower :float;
var maxSteer : float;

var power : float;
var brake : float;
var steer : float;
var speedTurn: float;
var speed : float;
var brakePower: float;



var drifting = false;
var driftingTimer : float;
var driftingTimeout : float;

var regFriction : float;
var driftFriction : float;
var driftFwdFriction : float;
var frictionRatio : float;

var startDrift;
var endDrift;
var pos;
var prevPos;

var startDriftAngVel : float;
var endDriftAngVel : float;

var rigidbodyAngVel : float;

var steerMultiplier : float;

var maxSpeed : float;
var minDriftSpeed : float;
var style : GUIStyle;
//-----------------------------






function OnLoaded() {
     btnX = Screen.width * 0.01;
     btnY = Screen.width * 0.01;
     btnW = Screen.width * 0.2;
     btnH = Screen.width * 0.05;
     //reverse = false;
     
     enginePower = 10;
     maxSteer = 12;
     
}

function SpawnCar(){ 
   
    switch(selectNumber){
        case 0:
            Network.Instantiate(avatar0, transform.position, transform.rotation, 0);
            playerClone = avatar0.name + "(Clone)"; 
        break;
        case 1:
            Network.Instantiate(avatar1, transform.position, transform.rotation, 0);
            playerClone = avatar1.name + "(Clone)"; 
        break;
        case 2:
            Network.Instantiate(avatar2, transform.position, transform.rotation, 0);
            playerClone = avatar2.name + "(Clone)"; 
        break;
        case 3:
            Network.Instantiate(avatar3, transform.position, transform.rotation, 0);
            playerClone = avatar3.name + "(Clone)"; 
        break;
        case 4:
            Network.Instantiate(avatar4, transform.position, transform.rotation, 0);
            playerClone = avatar4.name + "(Clone)";  
        break;
    }
 	
  	Player = GameObject.Find(playerClone);
    //Player.rigidbody.freezeRotation = true;
}

function OnGUI(){
     
     if(!selected){
         if(GUI.Button(Rect(btnX, btnY * 3, btnW, btnH), "MoonCar")){
             selectNumber = 0;
             selected = true;
             SpawnCar();
         }
         else if(GUI.Button(Rect(btnX, btnY * 9, btnW, btnH), "Arcade")){
             selectNumber = 1;
             selected = true;
             SpawnCar();
         }
         else if(GUI.Button(Rect(btnX, btnY * 15, btnW, btnH), "Charger")){
             selectNumber = 2;
             selected = true;
             SpawnCar();
         }
         else if(GUI.Button(Rect(btnX, btnY * 21, btnW, btnH), "Colt")){
             selectNumber = 3;
             selected = true;
             SpawnCar();
         }
         else if(GUI.Button(Rect(btnX, btnY * 27, btnW, btnH), "Pgt")){
             selectNumber = 4;
             selected = true;
             SpawnCar();
         }
         else
         {
         }  
     }
}
    

function Update()
{       
//    style.fontStyle = FontStyle.Italic;
//    style.normal.textColor = Color.white;
//    style.fontSize = 40;
//    GUI.Label(Rect(Screen.width - 370, 80, 100, 100),"Speed: ", style);
//    style.fontSize = 40;
//    style.fontStyle = FontStyle.BoldAndItalic;
//    style.normal.textColor = Color.white;
	
	speed=Player.rigidbody.velocity.magnitude * 3.6;

    power=Input.GetAxis("Vertical") * enginePower * Time.deltaTime * 250.0;
    steer=Input.GetAxis("Horizontal") * maxSteer * Mathf.Clamp(speedTurn/speed, 0, 1);
    brake=Input.GetButton("Jump") ? brakePower: 0.0;   
	
	
	rigidbodyAngVel = Player.rigidbody.angularVelocity.y;
	
	if((rigidbodyAngVel >= startDriftAngVel || rigidbodyAngVel <= - startDriftAngVel) && speed >= minDriftSpeed)
	{
		driftingTimer += Time.deltaTime;
	}
	if(driftingTimer >= driftingTimeout)
	{
		startDrift = true;
		driftingTimer = 0;
	}
	
	if(rigidbodyAngVel > 0)
	{
		if(rigidbodyAngVel <= endDriftAngVel || speed <= minDriftSpeed/3)
		{
			endDrift = true;
		}
	}
	else
	{
		if(rigidbodyAngVel >= -endDriftAngVel || speed <= minDriftSpeed/3)
		{
			endDrift = true;
		}
	}

	//determine this based on forward speed and (angularVelocity?) or another method of determining sideways force.
	if(startDrift)
	{
		drifting = true;
		startDrift = false;
	}
	else if(endDrift)
	{
		drifting = false;
		endDrift = false;
		driftingTimer = 0;
	}

    
    if(speed < maxSpeed)
    {
        frLeft.brakeTorque=power/10;
		frRight.brakeTorque=power/10;
        reLeft.brakeTorque=power/10;
        reRight.brakeTorque=power/10;
        reLeft.motorTorque=power;
        reRight.motorTorque=power;
    }
    else
    {
    	frLeft.brakeTorque=power/10;
		frRight.brakeTorque=power/10;
        reLeft.brakeTorque=power/10;
        reRight.brakeTorque=power/10;
        reLeft.motorTorque=0;
        reRight.motorTorque=0;
    }
    
    if(drifting)
    {
    	if(rigidbodyAngVel > 0)
    	{
    		frLeft.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction, regFriction, rigidbodyAngVel/endDriftAngVel), 2), driftFriction, regFriction);
        	frRight.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction, regFriction, rigidbodyAngVel/endDriftAngVel), 2), driftFriction, regFriction);
        	reLeft.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction/frictionRatio, regFriction, rigidbodyAngVel/endDriftAngVel), 2), driftFriction/frictionRatio, regFriction);
        	reRight.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction/frictionRatio, regFriction, rigidbodyAngVel/endDriftAngVel), 2), driftFriction/frictionRatio, regFriction);
        }
        else
        {
       		frLeft.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction, regFriction, -rigidbodyAngVel/endDriftAngVel), 2), driftFriction, regFriction);
        	frRight.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction, regFriction, -rigidbodyAngVel/endDriftAngVel), 2), driftFriction, regFriction);
        	reLeft.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction/frictionRatio, regFriction, -rigidbodyAngVel/endDriftAngVel), 2), driftFriction/frictionRatio, regFriction);
        	reRight.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction/frictionRatio, regFriction, -rigidbodyAngVel/endDriftAngVel), 2), driftFriction/frictionRatio, regFriction);
        }
        
        frLeft.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, rigidbodyAngVel/endDriftAngVel), 2), driftFwdFriction, 1);
        frRight.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, rigidbodyAngVel/endDriftAngVel), 2), driftFwdFriction, 1);
        reLeft.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, rigidbodyAngVel/endDriftAngVel), 2), driftFwdFriction, 1);
        reRight.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, rigidbodyAngVel/endDriftAngVel), 2), driftFwdFriction, 1);
    	
    	//driftingTimer += Time.deltaTime;
    	
    	steer *= steerMultiplier;
    	
    }
    else
    {
    	frLeft.sidewaysFriction.stiffness = regFriction;
        frRight.sidewaysFriction.stiffness = regFriction;
        reLeft.sidewaysFriction.stiffness = regFriction;
        reRight.sidewaysFriction.stiffness = regFriction;
        
        frLeft.forwardFriction.stiffness = 1;
        frRight.forwardFriction.stiffness = 1;
        reLeft.forwardFriction.stiffness = 1;
        reRight.forwardFriction.stiffness = 1;
    }
    
//    if(driftingTimer >= driftingTimeout)
//    {
//    	drifting = false;
//    	driftingTimer = 0.0f;
//    }
    
    if(brake > 0.0)
    {
        frLeft.brakeTorque=50;
        frRight.brakeTorque=50;
        reLeft.brakeTorque=50;
        reRight.brakeTorque=50;

        reLeft.motorTorque=0.0;
        reRight.motorTorque=0.0;
    } 
    
    
    frLeft.steerAngle=steer;
    frRight.steerAngle=steer;
    
    GUI.Label(Rect(Screen.width - 220, 80, 100, 100), speed.ToString(), style);
}