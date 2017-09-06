<?php

  session_start();
  $content = $_POST["content"];
  $value = $_POST["value"];
  $user = $_POST["user"];
  $advanced = $_POST["advanced"];
  $mobile = $_POST["mobile"];
  $input = $_POST["input"];
  $label = $_POST["label"];
  $description = $_POST["description"];
  include("../../sql.php");

  try {
    $sql = "INSERT INTO yourmood.settings (active, setting, value, user, advanced, mobile, input, label, description) VALUES (1, '$content', '$value', '$user', '$advanced', '$mobile', '$input', '$label', '$description')";
    $_SESSION["alert"] = "Successfully created setting.";
  } catch (Exception $e) {
    $_SESSION["alert"] = "Failed to create setting. Error: ${e}";
  }

  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
  $conn->close();
  //header("location: .");
