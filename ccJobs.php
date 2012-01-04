<?php
/*
ccJobs.php
tjs 091204

file version 1.01 

release version 1.05
*/
//http://localhost/ccJobs.php?account=0&typeId=1&customerId=1&description=desca&id=0&remove=false

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
header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?>";
$newId = -1;
if ($id == 0) {
// add the new job
$sql="INSERT INTO jobs (account, typeId, customerId, description)
VALUES
('$account','$_GET[typeId]','$_GET[customerId]','$_GET[description]')";
} else {
	if ($remove == 'true') {
$sql = "UPDATE jobs SET isinactive = 1
WHERE id = $id";
	} else {
$sql = "UPDATE jobs SET typeId = '$_GET[typeId]',customerId = '$_GET[customerId]', description = '$_GET[description]'
WHERE id = $id";
	}
}

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
if ($id == 0) {
$newId = mysql_insert_id($con);
}
mysql_close();
echo '<job id="'.$newId.'"/>'

?> 


