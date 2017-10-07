<?php

  date_default_timezone_set('Australia/Melbourne');
  header("Access-Control-Allow-Origin: *");
  include("../../../assets/php/sql.php");
  $datetime = date('d/m/Y h:i:s a', time());
  $ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER['REMOTE_ADDR'];
  $version = mysqli_real_escape_string($mysqli, $_POST["version"]);
  $platform = mysqli_real_escape_string($mysqli, $_POST["platform"]);
  $userAgent = mysqli_real_escape_string($mysqli, $_POST["userAgent"]);
  $log = mysqli_real_escape_string($mysqli, $_POST["log"]);
  $mysqli->query("INSERT INTO yourmood.logs (sent_at, ip_address, version, platform, useragent, log) VALUES ('$datetime', '$ip', '$version', '$platform', '$userAgent', '$log')");
  $mysqli->close();
