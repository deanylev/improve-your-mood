<?php

  header("Access-Control-Allow-Origin: *");
  $ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER['REMOTE_ADDR'];
  $version = $_POST["version"];
  $platform = $_POST["platform"];
  $log = $_POST["log"];
  $sql = "INSERT INTO yourmood.logs (ip_address, version, platform, log) VALUES ('$ip', '$version', '$platform', '$log')";
  include("../../../sql.php");
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
