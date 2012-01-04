<?php
/*
ccGetLoginXML.php
tjs 091228

file version 1.00 

release version 1.05
*/
//http://localhost/ccGetLoginXML.php
require_once( "Member.class.php" );
session_start();

//if (isset($_SESSION['loginAccountNumber'])) {
//	$account = $_SESSION['loginAccountNumber'];
//	$lastName=$_SESSION['last'];
//	$firstName=$_SESSION['first'];
if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
	$lastName = $member->getValue( "lastName" );
	$firstName = $member->getValue( "firstName" );
} else {
	$account = 0;
	$lastName = 'collaborator';
	$firstName = 'demo';
}


header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?><login>";
echo '<account id="'.$account.'"><last>'.$lastName.'</last><first>'.$firstName.'</first></account>';
echo "</login>";

?> 


