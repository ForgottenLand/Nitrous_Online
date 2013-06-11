//CarController1.js

var fl : WheelCollider;
var fr : WheelCollider; 
var rl : WheelCollider; 
var rr : WheelCollider;

var enginePower=150.0;
var maxSteer=25.0;

var power=0.0;
var brake=0.0;
var steer=0.0;
var speedTurn: float;

var speed : float;

var style:GUIStyle;

var drifting = false;
var driftingTimer = 0.0f;
var driftingTimeout = 2.0f;

var regFriction: float;
var driftFriction: float;
var driftFwdFriction: float;
var frictionRatio: float;

var startDrift;
var endDrift;

function Awake(){
    
    rigidbody.centerOfMass=Vector3(0,-0.9,0.3);
    pos = transform.position;
    prevPos = pos;
    speed = 0;
}

function Update () {
	style.fontStyle = FontStyle.Italic;
    style.normal.textColor = Color.white;
    style.fontSize = 40;
    GUI.Label(Rect(Screen.width - 370, 80, 100, 100),"Speed: ", style);
    style.fontSize = 40;
    style.fontStyle = FontStyle.BoldAndItalic;
    style.normal.textColor = Color.white;
	
	speed=rigidbody.velocity.magnitude*3.6;
	
    power=Input.GetAxis("Vertical") * enginePower * Time.deltaTime * 250.0;
    steer=Input.GetAxis("Horizontal") * maxSteer * Mathf.Clamp(speedTurn/speed, 0, 1);
    brake=Input.GetButton("Jump") ? rigidbody.mass * 0.1: 0.0;   

	if(startDrift)
	{
		drifting = true;
	}
	else if(endDrift)
	{
		drifting = false;
	}

    if(brake > 0.0){

        fl.brakeTorque=brake;
        fr.brakeTorque=brake;
        rl.brakeTorque=brake;
        rr.brakeTorque=brake;

        rl.motorTorque=0.0;
        rr.motorTorque=0.0;
        
        //drifting = true;
        //driftingTimer = 0;
        
        
        
        //steer *= 3;
    } else {

        fl.brakeTorque=0;
		fr.brakeTorque=0;
        rl.brakeTorque=0;
        rr.brakeTorque=0;
        rl.motorTorque=power;
        rr.motorTorque=power;
    }
    
    if(drifting)
    {
    
    	fl.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction, regFriction, driftingTimer/driftingTimeout), 2), driftFriction, 1);
        fr.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction, regFriction, driftingTimer/driftingTimeout), 2), driftFriction, 1);
        rl.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction/frictionRatio, regFriction, driftingTimer/driftingTimeout), 2), driftFriction/frictionRatio, 1);
        rr.sidewaysFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFriction/frictionRatio, regFriction, driftingTimer/driftingTimeout), 2), driftFriction/frictionRatio, 1);
        
        fl.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, driftingTimer/driftingTimeout), 2), driftFwdFriction, 1);
        fr.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, driftingTimer/driftingTimeout), 2), driftFwdFriction, 1);
        rl.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, driftingTimer/driftingTimeout), 2), driftFwdFriction, 1);
        rr.forwardFriction.stiffness = Mathf.Clamp(Mathf.Pow(Mathf.Lerp(driftFwdFriction, 1, driftingTimer/driftingTimeout), 2), driftFwdFriction, 1);
    	
    	//driftingTimer += Time.deltaTime;
    	
    	steer *= 3;
    	
    }
    else
    {
    	fl.sidewaysFriction.stiffness = regFriction;
        fr.sidewaysFriction.stiffness = regFriction;
        rl.sidewaysFriction.stiffness = regFriction;
        rr.sidewaysFriction.stiffness = regFriction;
        
        fl.forwardFriction.stiffness = 1;
        fr.forwardFriction.stiffness = 1;
        rl.forwardFriction.stiffness = 1;
        rr.forwardFriction.stiffness = 1;
    }
    
//    if(driftingTimer >= driftingTimeout)
//    {
//    	drifting = false;
//    	driftingTimer = 0.0f;
//    }
    
    fl.steerAngle=steer;
    fr.steerAngle=steer;
    
    GUI.Label(Rect(Screen.width - 220, 80, 100, 100), speed.ToString(), style);
    
}
