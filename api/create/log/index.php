<?php

  $ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER['REMOTE_ADDR'];
  $version = $_GET["version"];
  $log = $_GET["log"];
  $sql = "INSERT INTO yourmood.logs (ip_address, version, log) VALUES ('$ip', '$version', '$log')";
  include("../../../sql.php");
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
