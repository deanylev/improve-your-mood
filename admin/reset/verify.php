<?php

  session_start();

  if (isset($_SESSION["user"])) {
      header("location: ../home");
  }

  include("../../assets/php/sql.php");

  if ($_POST["reset_code"] === $_SESSION["reset_code"]) {
    $password = md5("password");
    $mysqli->query("DELETE FROM yourmood.users WHERE user = 'admin'");
    $mysqli->query("INSERT INTO yourmood.users (user, password) VALUES ('admin', '${password}')");
    $mysqli->close();
    unset($_SESSION["reset_code"]);
    unlink("reset_code.txt");
    $_SESSION["message"]["success"] = "Default user has been created with credentials <b>admin</b> and <b>password</b>. Please log in and change this password <b>immediately</b>.";
    header("location: ../login");
  } else {
    $_SESSION["message"]["danger"] = "Reset code incorrect. New one generated.";
    header("location: .");
  }

?>
