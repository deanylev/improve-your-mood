<?php

  date_default_timezone_set('Australia/Melbourne');
  header("Access-Control-Allow-Origin: *");
  include("../../../sql.php");
  $datetime = date('d/m/Y h:i:s a', time());
  $ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER['REMOTE_ADDR'];
  $version = mysqli_real_escape_string($conn, $_POST["version"]);
  $platform = mysqli_real_escape_string($conn, $_POST["platform"]);
  $userAgent = mysqli_real_escape_string($conn, $_POST["userAgent"]);
  $log = mysqli_real_escape_string($conn, $_POST["log"]);
  $mysql->query = "INSERT INTO yourmood.logs (sent_at, ip_address, version, platform, useragent, log) VALUES ('$datetime', '$ip', '$version', '$platform', '$userAgent', '$log')";
  $mysql->run_query();
  $mysql->disconnect();
