<?php

  header("Access-Control-Allow-Origin: *");
  include("../../../assets/php/sql.php");
  include("../../../admin/assets/php/user.php");
  $id = $_POST["id"];
  $settings = mysqli_real_escape_string($mysqli, $_POST["settings"]);
  if (isset($_SESSION["user"]) && (!$currentUser["read_only"] || $id == $_SESSION["user"])) {
    $mysqli->query("UPDATE yourmood.users SET app_settings = '{$settings}' WHERE id = '{$id}'");
    $mysqli->close();
    echo "success";
  } else {
    echo "unauthorised";
  }
