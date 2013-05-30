var avatar0 : Transform;
var Player : GameObject;
var playerClone: String;

function OnLoaded(){ 
 	Network.Instantiate(avatar0, transform.position, transform.rotation, 0);
 	playerClone = "EmptyMoonCar(Clone)";  
  	Player = GameObject.Find(playerClone);
}