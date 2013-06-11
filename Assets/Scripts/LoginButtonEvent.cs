using UnityEngine;
using System.Collections;

public class LoginButtonEvent : MonoBehaviour {
	
	public GameObject UsernameObj, PasswordObj, authObj;
	
	void OnClick ()
	{
		Authentication authScript = (Authentication) authObj.GetComponent(typeof(Authentication));
		UILabel username = (UILabel) UsernameObj.GetComponent(typeof(UILabel));
		UILabel password = (UILabel) PasswordObj.GetComponent(typeof(UILabel));
		if(authScript.Authenticate(username.text,password.text)){
			Application.LoadLevel("NGUIPreRace");
		} else {
			
		}
	}
	
}

