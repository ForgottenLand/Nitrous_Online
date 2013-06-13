using UnityEngine;
using System.Collections;

public class RegisterButtonEvent : MonoBehaviour {
	
	public GameObject usernameObj, passwordObj, authObj, messageObj, uLabel, pLabel;
	
	void OnClick ()
	{
		Vector3 usernameScale = usernameObj.transform.localScale;
    	usernameScale.x = 0.5f;
		usernameScale.y = 0.5f;
		usernameObj.transform.localScale = usernameScale;
		
		Vector3 passwordScale = passwordObj.transform.localScale;
    	passwordScale.x = 0.5f;
		passwordScale.y = 0.5f;
		passwordObj.transform.localScale = passwordScale;
		
		Vector3 uLabelScale = uLabel.transform.localScale;
    	uLabelScale.x = 50f;
		uLabelScale.y = 50f;
		uLabel.transform.localScale = uLabelScale;
		
		Vector3 pLabelScale = pLabel.transform.localScale;
    	pLabelScale.x = 50f;
		pLabelScale.y = 50f;
		pLabel.transform.localScale = pLabelScale;
		
		UILabel message = (UILabel) messageObj.GetComponent(typeof(UILabel));
		message.text = "Wanna join the cool kids huh?";
	}
	
}
