	import System;
	import System.Data;
	import System.Data.SqlClient;
	var dbcmd : IDbCommand;
	var cmdSql : String;
	var cmdSql2 : String;
	
	function Start () {
    	
	var dbcon : IDbConnection;
    var connectionString : String =
        "Server=96.31.33.42;" + // put the ip here!
        "Database=SQL2012_924853_forgotten;" +
        "User ID=SQL2012_924853_forgotten_user;" +
        "Password=Passnew1994!;";
    dbcon = new SqlConnection(connectionString);
    dbcon.Open();
    
    //create the class EXECUTIONER, that execute SQL commands
    dbcmd = dbcon.CreateCommand();
    
    
    
    //string var, to save the command we want to use
    cmdSql = "SELECT UserName, Email, Password FROM [SQL2012_924853_forgotten].[dbo].[Table1]";
    //cmdSql2 = "DELETE FROM [SQL2012_924853_forgotten].[dbo].[Table1] WHERE UserName = 'johnwyz55';";
    cmdSql3 = "INSERT INTO [SQL2012_924853_forgotten].[dbo].[Table1] (UserName, Email, Password) VALUES ('johnwyz66','johnwyz66@gmail.com','123456');";
    
    
    
    
    //we add the command, as string, to the executor, to shot it!
    dbcmd.CommandText = cmdSql3;
    dbcmd.CommandText = cmdSql; 
    
    
    
    
    //and then, we create a table, like a normal db table, to use it on unity, and we use the function that "plays" the command
    var reader : IDataReader = dbcmd.ExecuteReader();
    
    while(reader .Read()) {
        var UserName : String = reader ["UserName"].ToString();
        var Email : String = reader ["Email"].ToString();
        var Password : String = reader ["Password"].ToString();
        print ("UserName: " + UserName + "Email: " + Email + "Password: " + Password);
    }
 
              
    reader .Close();
    reader = null;
    dbcon.Close();
    dbcon = null;
    
}