<?php

  header("Access-Control-Allow-Origin: *");
  include("../../../assets/php/sql.php");
  $datetime = date("Y-m-d H:i:s");
  $ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER['REMOTE_ADDR'];
  $version = mysqli_real_escape_string($mysqli, $_POST["version"]);
  $userAgent = mysqli_real_escape_string($mysqli, $_POST["userAgent"]);
  $localStorage = mysqli_real_escape_string($mysqli, $_POST["localStorage"]);
  $log = mysqli_real_escape_string($mysqli, $_POST["log"]);
  $mysqli->query("INSERT INTO yourmood.logs (created_at, ip_address, version, useragent, localstorage, log) VALUES ('$datetime', '$ip', '$version', '$userAgent', '$localStorage', '$log')");
  $mysqli->close();
