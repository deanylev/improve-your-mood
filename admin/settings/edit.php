<?php

  session_start();
  $id = $_POST["id"];
  $content = $_POST["content"];
  $value = $_POST["value"];
  include("../../sql.php");
  $sql = "UPDATE yourmood.settings SET setting='$content', value = '$value' WHERE id='$id'";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully edited setting.";
  header("location: .");
