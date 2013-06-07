var StateNumber : int;

var signInBoxWidth;
var signInBoxHeight;
var registerBoxWidth;
var registerBoxHeight;

public var UserName : String;
var UserNameLabelWidth;

public var Email : String;
var EmailLabelWidth;

public var Password : String;
public var ReEnter : String;
var PasswordLabelWidth;

public var FirstName : String;
var FirstNameLabelWidth;

public var LastName : String;
var LastNameLabelWidth;

public var CardHolderFirstName : String;
var CardHolderFirstNameLabelWidth;

public var CardHolderLastName : String;
var CardHolderLastNameLabelWidth;

public var Address1 : String;
var Address1LabelWidth;

public var Address2 : String;
var Address2LabelWidth;

public var City : String;
var CityLabelWidth;

public var Province : String;
var ProvinceLabelWidth;

public var Country : String;
var CountryLabelWidth;

public var Postal : String;
var PostalLabelWidth;

public var Phone : String;
var PhoneLabelWidth;

public var CreditNumber : String;
var CreditNumberLabelWidth;

public var CVV : String;
var CVVLabelWidth;

public var ExpireMonth : String;
var ExpireMonthLabelWidth;

public var ExpireYear : String;
var ExpireYearLabelWidth;

var TextboxHeight;

var guiStyle : GUIStyle;

var gmObj : GameObject;
var auth : Authentication;

function Start() {
	signInBoxWidth = 300;
	signInBoxHeight = 120;
	registerBoxWidth = 600;
	registerBoxHeight = 200;	
	TextboxHeight = 22;	
	StateNumber = 1;
	
	auth = gmObj.GetComponent(Authentication);
}

function OnGUI () {
	switch (StateNumber){
		case 1:
			StateSignIn();
		break;
		case 2:
			StateReg ();
		break;
		case 3:
			StateLoggedIn();
		break;
	}
}

function StateSignIn () {
	if( Screen.width - signInBoxWidth - 10 >= 10 ) {
		LabelWidth = 60;
		GUI.Box(Rect (Screen.width - signInBoxWidth - 10,10,signInBoxWidth,signInBoxHeight), "Sign in");
		
		GUI.Label (Rect (Screen.width - signInBoxWidth, 40, LabelWidth, 22), "Username");
		UserName = GUI.TextField (Rect (Screen.width - signInBoxWidth + LabelWidth + 10, 40, signInBoxWidth - LabelWidth - 30, TextboxHeight),UserName,40);
	
		GUI.Label (Rect (Screen.width - signInBoxWidth, 70, LabelWidth, 22), "Password");
		Password = GUI.TextField (Rect (Screen.width - signInBoxWidth + LabelWidth + 10, 70, signInBoxWidth - LabelWidth - 30, TextboxHeight),Password,40);
	
		if( GUI.Button (Rect (Screen.width - signInBoxWidth, 100, (signInBoxWidth - 40) / 2, 22), "Sign in") ) {
			//Call StateRead
			ReadSignIn();
		}
		
		if( GUI.Button (Rect (Screen.width - signInBoxWidth + (signInBoxWidth - 40) / 2 + 20, 100, (signInBoxWidth - 40) / 2, 22), "Register") ) {
			//Call StateReg
			StateNumber = 2;
		}
	}
	else {
		
		GUI.Box(Rect (10, 10, Screen.width - 20, signInBoxHeight), "Sign in window");
		
		LabelWidth = 20;
		GUI.Label (Rect (20, 40, UserNameLabelWidth, 22), "UN");
		UserName = GUI.TextField (Rect (45, 40, Screen.width - 65, TextboxHeight),UserName,40);
	
		LabelWidth = 22;
		GUI.Label (Rect (20, 70, PasswordLabelWidth, 22), "PW");
		Password = GUI.TextField (Rect (47, 70, Screen.width - 67, TextboxHeight),Password,40);
		
		if( GUI.Button (Rect (20, 100, (Screen.width - 45) / 2, 22), "Sign in") ) {
			//Call StateRead
			ReadSignIn();
		}
		
		if( GUI.Button (Rect ( Screen.width / 2 + 5, 100, (Screen.width - 45) / 2, 22), "Register") ) {
			//Call StateReg
			StateNumber = 2;
		}
	}		
}

function StateReg () {

	LabelWidth = Screen.width / 5;
	
	GUI.Box(Rect (10, 10, Screen.width - 20, 250), "Registration window");
	
	GUI.Label (Rect (20, 40, LabelWidth, 22), "Username");
	UserName = GUI.TextField (Rect (LabelWidth + 30, 40, Screen.width - LabelWidth - 65, TextboxHeight),UserName,40);
	
	GUI.Label (Rect (20, 70, LabelWidth, 22), "Password");
	Password = GUI.TextField (Rect (LabelWidth + 30, 70, Screen.width - LabelWidth - 65, TextboxHeight),Password,40);
	
	GUI.Label (Rect (20, 100, LabelWidth, 22), "Re-enter");
	ReEnter = GUI.TextField (Rect (LabelWidth + 30, 100, Screen.width - LabelWidth - 65, TextboxHeight),ReEnter,40);
	
	GUI.Label (Rect (20, 130, LabelWidth, 22), "Email");
	Email = GUI.TextField (Rect (LabelWidth + 30, 130, Screen.width - LabelWidth - 65, TextboxHeight),Email,40);
	
	GUI.Label (Rect (20, 160, LabelWidth, 22), "FirstName");
	FirstName = GUI.TextField (Rect (LabelWidth + 30, 160, Screen.width - LabelWidth - 65, TextboxHeight),FirstName,40);
	
	GUI.Label (Rect (20, 190, LabelWidth, 22), "LastName");
	LastName = GUI.TextField (Rect (LabelWidth + 30, 190, Screen.width - LabelWidth - 65, TextboxHeight),LastName,40);
		
	if( GUI.Button (Rect (20, 230, (Screen.width - 45) / 2, 22), "Back to sign in") ) {
		//Call StateSignIn
		StateNumber = 1;
	}
		
	if( GUI.Button (Rect ( Screen.width / 2 + 5, 230, (Screen.width - 45) / 2, 22), "Confirm") ) {
		//Call StateReg
		ReadRegister();
	}
}

function ReadSignIn() {
	if(auth.Authenticate(UserName, Password)){
		//User is authenticated
		print ("Username: " + UserName + " is authenticated, username is found and password match");
		StateNumber = 3;
	}
	else {
		//User is not authenticated
		print ("Username: " + UserName + " is not authenticated, either password is incorrect or username does not exist");
	}
}

function ReadRegister() {
	if(UserName == ""){
		print("Username should not be null");
	}
	else if(Password == ""){
		print("Password should not be null");
	}
	else if(Password.Length < 6){
		print("Password should be at least 6 digits long");
	}
	else if(!ReEnter.Equals(Password)){
		print("Re-entered password does not match");
	}
	else if(Email == ""){
		print("Email should not be null");
	}
	else if(!Email.Contains("@") || !Email.Contains(".com")) {
		print("Email entered is not valid");
	}
	else if(FirstName == ""){
		print("Firstname should not be null");
	}
	else if(LastName == ""){
		print("LastName should not be null");
	}
	else{
		if(auth.NewUser(UserName, Email, Password, FirstName, LastName)){
			//New user is registered
			print("Username: " + UserName + " is added to Database Registry Table");
			StateNumber = 3;
		}
		else {
			//Not eligible
			print("Username: " + UserName + " already exists, please choose a different username.");
		}
	}
	
}

function StateLoggedIn() {
	
}

function Hash () {
	
}

function Salt () {
	
}

function Unhash () {
	
}

function Unsalt () {
	
}