<?php
/*
ccGetPartsXML.php
tjs 091120

file version 1.01 

release version 1.05
*/
//http://localhost/ccGetPartsXML.php

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
//tjs101011
define("MYSQL_HOST", "localhost");

$username="root";
$password="root";
$database="COLLORG";


mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?><parts>";

$query="SELECT * FROM parts where account = 0 or account = ".$account;
$result=mysql_query($query);
$num=mysql_numrows($result);
$i=0;
while ($i < $num) {
$partId=mysql_result($result,$i,"id");
$supplierId=mysql_result($result,$i,"supplierId");
$sku =mysql_result($result,$i,"sku");
$attributes =mysql_result($result,$i,"attributes");
$description =mysql_result($result,$i,"description");
$cost =mysql_result($result,$i,"cost");
$partName=mysql_result($result,$i,"name");
$parta = '<part id="'.$partId.'"><name>'.$partName.'</name><supplier id="'.$supplierId.'">';
$skuPart = '<sku/>';
if (strlen($sku) > 0)
	$skuPart = '<sku>'.$sku.'</sku>';
$attributesPart = '<attributes/>';
if (strlen($attributes) > 0)
	$attributesPart = '<attributes>'.$attributes.'</attributes>';
$descriptionPart = '<description/>';
if (strlen($description) > 0)
	$descriptionPart = '<description>'.$description.'</description>';
$part = $parta.$skuPart.$attributesPart.$descriptionPart.'<cost>'.$cost.'</cost></supplier></part>';	
echo $part;

$i++;
}

mysql_close();
echo "</parts>";

?> 


