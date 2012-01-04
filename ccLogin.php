<?php
/*
ccLogin.php
tjs 091119

file version 1.00 

release version 1.05
*/

$account = $_GET['account'];
$first = $_GET['first'];
$last = $_GET['last'];

session_start();
			$_SESSION["loginAccountNumber"] = $account;
			$_SESSION['last'] = $last;
			$_SESSION['first'] = $first;

?> 


