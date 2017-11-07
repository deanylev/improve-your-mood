<?php

  date_default_timezone_set('Australia/Melbourne');
  header("Access-Control-Allow-Origin: *");
  include("../../../assets/php/sql.php");
  $settings = mysqli_real_escape_string($mysqli, $_POST["settings"]);
  $id = $_POST["id"];
  $mysqli->query("UPDATE yourmood.users SET app_settings = '{$settings}' WHERE id = '{$id}'");
  $mysqli->close();
