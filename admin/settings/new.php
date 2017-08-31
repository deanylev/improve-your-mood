<?php

  session_start();
  $content = $_POST["content"];
  $value = $_POST["value"];
  $description = $_POST["description"];
  include("../../sql.php");
  $sql = "INSERT INTO yourmood.settings (active, setting, value, description) VALUES (1, '$content', '$value', '$description')";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully created setting.";
  header("location: .");
