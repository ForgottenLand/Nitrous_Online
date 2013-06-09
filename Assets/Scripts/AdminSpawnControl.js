var avatar0 : Transform;
var avatar1 : Transform;
var avatar2 : Transform;
var avatar3 : Transform;
var avatar4 : Transform;

private var btnX:float;
private var btnY:float;
private var btnW:float;
private var btnH:float;

public var selectNumber : int;
var selected : boolean;

public static var Player : GameObject;
var playerClone: String;

var forwardSpeed : float;
var turnSpeed : float;
var style:GUIStyle;
var Impulse : float;
public var currentForce : float;
var maxForce : float;
var rolling : boolean;
var realSpeed : float;
var reverse : boolean;

function OnLoaded() {
     btnX = Screen.width * 0.01;
     btnY = Screen.width * 0.01;
     btnW = Screen.width * 0.2;
     btnH = Screen.width * 0.05;
     maxForce = 1500000;
     reverse = false;
}

function SpawnCar(){ 
   
    switch(selectNumber){
        case 0:
            Network.Instantiate(avatar0, transform.position, transform.rotation, 0);
            playerClone = "EmptyMoonCar(Clone)"; 
        break;
        case 1:
            Network.Instantiate(avatar1, transform.position, transform.rotation, 0);
            playerClone = "EmptyArcade(Clone)"; 
        break;
        case 2:
            Network.Instantiate(avatar2, transform.position, transform.rotation, 0);
            playerClone = "EmptyCharger(Clone)"; 
        break;
        case 3:
            Network.Instantiate(avatar3, transform.position, transform.rotation, 0);
            playerClone = "EmptyColt(Clone)"; 
        break;
        case 4:
            Network.Instantiate(avatar4, transform.position, transform.rotation, 0);
            playerClone = "EmptyPgt(Clone)"; 
        break;
    }
 	
  	Player = GameObject.Find(playerClone);
    Player.rigidbody.freezeRotation = true;
}

function OnGUI(){
    //Scale screen properly
//	var screenScale: float = Screen.width / 320.0;
//    var scaledMatrix: Matrix4x4 = Matrix4x4.identity.Scale(Vector3(screenScale,screenScale,screenScale));
//    GUI.matrix = scaledMatrix;
     
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

    try{
         if(Application.platform == RuntimePlatform.WindowsPlayer || Application.platform == RuntimePlatform.WindowsEditor){
         style.fontStyle = FontStyle.Italic;
         style.normal.textColor = Color.white;
         style.fontSize = 40;
         GUI.Label(Rect(Screen.width - 370, 80, 100, 100),"Speed: ", style);
         style.fontStyle = FontStyle.BoldAndItalic;
         realSpeed = Player.rigidbody.velocity.magnitude;
         GUI.Label(Rect(Screen.width - 220, 80, 100, 100),realSpeed.ToString(), style);
         if(Input.GetKey("a") && !reverse){
             Player.transform.Rotate(0,-0.2,0); 
         } else if(Input.GetKey("d") && !reverse){
             Player.transform.Rotate(0,0.2,0); 
         } else if(Input.GetKey("a") && reverse){
             Player.transform.Rotate(0,0.2,0); 
         } else if(Input.GetKey("d") && reverse){
             Player.transform.Rotate(0,-0.2,0); 
         } 
         if(Input.GetKey("w")){
             Impulse = 800;
             rolling = false;
         } else if(Input.GetKey("s")){
             Impulse = -3000;
             rolling = false;
         } else {
             rolling = true;
             Impulse = 0;
         }
         if(currentForce <= maxForce && Impulse > 0)
         {   
             currentForce += Impulse;
             reverse = false;
         }
         if(currentForce >= 0 && Impulse < 0 && realSpeed >= 2)
         {
             currentForce += Impulse;
             reverse = false;
         }
         if(currentForce < 0 && currentForce >= (-maxForce/50) && Impulse < 0 && realSpeed < 2)
         {
             currentForce += Impulse;
             reverse = true;
         } 
         
         if(rolling && currentForce > 0)
             currentForce -= 100;
         else if(rolling && currentForce < 0)
             currentForce += 100;
         
        Player.rigidbody.AddRelativeForce(0,0,currentForce); 
   
         
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