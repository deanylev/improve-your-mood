<?php

  session_start();
  $id = $_POST["id"];
  include("../../sql.php");
  $value = $_POST["action"] ? 1 : 0;
  $sql = "UPDATE yourmood.settings SET `active` = $value WHERE id = '$id'";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $text = $value ? "active" : "inactive";
  $_SESSION["alert"] = "Successfully set setting to {$text}.";
  header("location: .");
