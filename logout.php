<?php
//require_once( "../common.inc.php" );
require_once( "common.inc.php" );
session_start();
$_SESSION["member"] = "";
displayPageHeader( "Logged out", true );
?>
    <p>Thank you, you are now logged out. <a href="login.php?authenticated=false">Login again</a>.</p>
    <br/>
    <!-- p><a href="index.html?authenticated=false"><img src="images/home.gif"></a></p -->
    <p><a href="ccIndex.html?authenticated=false"><img src="images/home.gif"></a></p>
<?php
  displayPageFooter();
?>
