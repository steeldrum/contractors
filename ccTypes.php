<?php
/*
ccTypes.php
tjs 091124

file version 1.01 

release version 1.05
*/
//http://localhost/ccTypes.php?account=0&name=lc8&description=fc8&id=4&remove=false

$account = $_GET['account'];
//session_start();
//if (isset($_SESSION['loginAccountNumber'])) {
//	$account = $_SESSION['loginAccountNumber'];
//}
require_once( "Member.class.php" );
session_start();

//$account = 0;
//if ($account == 0 && isset($_SESSION['member'])) {
if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
} 

$id = $_GET['id'];
$remove = $_GET['remove'];

//tjs101011
define("MYSQL_HOST", "localhost");
$username="root";
$password="root";
$database="COLLORG";

$con = mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

if ($id == 0) {
// add the new type
//$sql="INSERT INTO types (name, description)
$sql="INSERT INTO types (account, name, description)
VALUES
('$account','$_GET[name]','$_GET[description]')";
} else {
	if ($remove == 'true') {
$sql = "UPDATE types SET isinactive = 1
WHERE id = $id";
	} else {
$sql = "UPDATE types SET name = '$_GET[name]', description = '$_GET[description]'
WHERE id = $id";
	}
}
echo $sql;

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

mysql_close();

?> 


