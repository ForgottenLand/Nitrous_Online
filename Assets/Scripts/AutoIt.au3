Run("C:\Users\John\Documents\MultiplayerProject\Bin\HeliumDemo.exe")
Sleep(2000)

Send("{ENTER}")
Sleep(2000)

MouseClick("Master Server")
Sleep(2000)

AutoItSetOption("SendKeyDelay", 400)
Send("{TAB}{TAB}{ENTER}")
Sleep(2000)

Send("Test Host{TAB}25006{ENTER}")
Send("{ENTER}")