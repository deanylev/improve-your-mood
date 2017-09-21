<?php

  session_start();
  $content = $_POST["content"];
  $value = $_POST["value"];
  $user = $_POST["user"];
  $optional = $_POST["optional"];
  $advanced = $_POST["advanced"];
  $mobile = $_POST["mobile"];
  $input = $_POST["input"];
  $label = $_POST["label"];
  $description = $_POST["description"];
  include("../../sql.php");

  $sql = "INSERT INTO yourmood.settings (active, setting, value, user, optional, advanced, mobile, input, label, description) VALUES (1, '$content', '$value', '$user', '$optional', '$advanced', '$mobile', '$input', '$label', '$description')";
  $_SESSION["alert"] = "Successfully created setting.";

  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $conn->close();
  header("location: .");
