<?php
if (!isset($langue_user) && !isset($_SESSION["lang"])){
	
	$langue_user=substr($_SERVER["HTTP_ACCEPT_LANGUAGE"], 0, 2);
	switch($langue_user){	

	case"fr":
	$_SESSION["lang"] = "fr";
	header ("Location: /religions/fr.html");	
	break;
		
	case "en":
	$_SESSION["lang"] = "en";
	header ("Location: /religions/en.html");
	break;
  	
	default:
	$_SESSION["lang"] = "en";
	header ("Location: /religions/en.html");
	break;
	}
}

?>