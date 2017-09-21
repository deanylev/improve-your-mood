<?php

  session_start();
  $id = $_POST["id"];
  if (isset($_POST["edit_item"])) {
    $content = $_POST["content"];
    $value = $_POST["value"];
    $user = $_POST["user"];
    $optional = $_POST["optional"];
    $advanced = $_POST["advanced"];
    $mobile = $_POST["mobile"];
    $input = $_POST["input"];
    $sql = "UPDATE yourmood.settings SET setting='$content', value = '$value', user = '$user', optional = '$optional', advanced = '$advanced', mobile = '$mobile', input = '$input' WHERE id='$id'";
  } elseif (isset($_POST["edit_description"])) {
    $label = $_POST["label"];
    $description = $_POST["description"];
    $sql = "UPDATE yourmood.settings SET label='$label', description='$description' WHERE id='$id'";
  }
  include("../../sql.php");
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully edited setting.";
  header("location: .");
