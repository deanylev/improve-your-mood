<?php

  session_start();
  header("Access-Control-Allow-Origin: *");
  include("../../../assets/php/sql.php");
  $id = $_POST["id"];
  $settings = mysqli_real_escape_string($mysqli, $_POST["settings"]);
  if (isset($_SESSION["user"]) && $id == $_SESSION["user"]) {
    $mysqli->query("UPDATE yourmood.users SET app_settings = '{$settings}' WHERE id = '{$id}'");
    $mysqli->close();
    echo "success";
  } else {
    echo "unauthorised";
  }
