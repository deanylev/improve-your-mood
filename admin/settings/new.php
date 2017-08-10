<?php

  session_start();
  $id = $_POST["id"];
  $content = $_POST["content"];
  $value = $_POST["value"];
  include("../../sql.php");
  $sql = "INSERT INTO yourmood.settings (active, setting, value) VALUES (1, '$content', '$value')";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully created setting.";
  header("location: .");
