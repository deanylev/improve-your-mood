<?php

  date_default_timezone_set('Australia/Melbourne');
  header("Access-Control-Allow-Origin: *");
  $datetime = date('d/m/Y h:i:s a', time());
  $ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER['REMOTE_ADDR'];
  $version = mysqli_real_escape_string ($_POST["version"]);
  $platform = mysqli_real_escape_string ($_POST["platform"]);
  $log = mysqli_real_escape_string($_POST["log"]);
  $sql = "INSERT INTO yourmood.logs (sent_at, ip_address, version, platform, log) VALUES ('$datetime', '$ip', '$version', '$platform', '$log')";
  include("../../../sql.php");
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
