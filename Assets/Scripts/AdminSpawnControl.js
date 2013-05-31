var avatar0 : Transform;
var Player : GameObject;
var playerClone: String;
var mc : car_control;
var forwardSpeed : float;
var turnSpeed : float;
var style:GUIStyle;
var acceleration : float;
var currentSpeed : float;
var maxSpeed: float;

function OnLoaded(){ 
 	Network.Instantiate(avatar0, transform.position, transform.rotation, 0);
 	playerClone = "EmptyMoonCar(Clone)";
  	Player = GameObject.Find(playerClone);
    Player.rigidbody.freezeRotation = true;
    maxSpeed = 1500000;
}

function OnGUI(){
    try{
         if(Application.platform == RuntimePlatform.WindowsPlayer || Application.platform == RuntimePlatform.WindowsEditor){
         style.fontStyle = FontStyle.Italic;
         style.normal.textColor = Color.white;
         style.fontSize = 40;
         GUI.Label(Rect(Screen.width - 370, 80, 100, 100),"Speed: ", style);
         style.fontSize = 40;
         style.fontStyle = FontStyle.BoldAndItalic;
         
         style.normal.textColor = Color.white;
         GUI.Label(Rect(Screen.width - 220, 80, 100, 100),(currentSpeed/4000).ToString(), style);
         if(Input.GetKey("a")){
             Player.transform.Rotate(0,-0.2,0); 
         } else if(Input.GetKey("d")){
             Player.transform.Rotate(0,0.2,0); 
         }
         if(Input.GetKey("w")){
             acceleration = 800;
         } else if(Input.GetKey("s")){
             acceleration = -800;
         } else {
             acceleration = -100;
         }
         if(currentSpeed <= maxSpeed && acceleration > 0)
         {   
             currentSpeed += acceleration;
         }
         if(currentSpeed >= 0 && acceleration < 0)
         {
             currentSpeed += acceleration;
         } 
            
         Player.rigidbody.AddRelativeForce(0,0,currentSpeed); 
        }
        else if(Application.platform == RuntimePlatform.Android){
         style.fontStyle = FontStyle.Italic;
         style.normal.textColor = Color.white;
         style.fontSize = 40;
         GUI.Label(Rect(Screen.width - 370, 80, 100, 100),"Speed: ", style);
         style.fontSize = 110;
         style.fontStyle = FontStyle.BoldAndItalic;
         if (Input.touches.Length == 0) {
         
             style.normal.textColor = Color.white;
             GUI.Label(Rect(Screen.width - 220, 40, 100, 100),"X 0", style);
             if(Input.acceleration.x < -0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * turnSpeed,0); 
             } else if(Input.acceleration.x > 0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * turnSpeed,0); 
             }
             Player.rigidbody.AddRelativeForce(0,0,0);
         
             
         } else if(Input.touches.Length == 1){
         
             style.normal.textColor = Color.green;
             GUI.Label(Rect(Screen.width - 220, 40, 100, 100),"X 1", style);
             Player.rigidbody.AddRelativeForce(0,0,forwardSpeed);
             if(Input.acceleration.x < -0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.05),0); 
             } else if(Input.acceleration.x > 0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.05),0); 
             }
             Player.rigidbody.AddRelativeForce(0,0,0);
     
         } else if(Input.touches.Length == 2){
         
             style.normal.textColor = Color.blue;
             GUI.Label(Rect(Screen.width - 220, 40, 100, 100),"X 2", style);
             Player.rigidbody.AddRelativeForce(0,0,forwardSpeed * 2);
             if(Input.acceleration.x < -0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.08),0); 
             } else if(Input.acceleration.x > 0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.08),0); 
             }
             Player.rigidbody.AddRelativeForce(0,0,0);
         
         } else if(Input.touches.Length == 3){
         
             style.normal.textColor = Color.yellow;
             GUI.Label(Rect(Screen.width - 220, 40, 100, 100),"X 3", style);
             Player.rigidbody.AddRelativeForce(0,0,forwardSpeed * 3);
             if(Input.acceleration.x < -0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.1),0); 
             } else if(Input.acceleration.x > 0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.1),0); 
             }
             Player.rigidbody.AddRelativeForce(0,0,0);
         
         } else if(Input.touches.Length > 3){
         
             style.normal.textColor = Color.magenta;
             GUI.Label(Rect(Screen.width - 220, 40, 100, 100),"X 4", style);
             Player.rigidbody.AddRelativeForce(0,0,forwardSpeed * 4);
             if(Input.acceleration.x < -0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.11),0); 
             } else if(Input.acceleration.x > 0.05){
                 Player.transform.Rotate(0,Input.acceleration.x * (turnSpeed-0.11),0); 
             }
             Player.rigidbody.AddRelativeForce(0,0,0);
         }   
        }
        else {
         Debug.Log(Application.platform.ToString());
        }
        }
        catch(UnityException)
        {}
}
//TODO: How to pass control to car control script