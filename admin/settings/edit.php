<?php

  session_start();
  $id = $_POST["id"];
  if (isset($_POST["edit_item"])) {
    $content = $_POST["content"];
    $value = $_POST["value"];
    $sql = "UPDATE yourmood.settings SET setting='$content', value = '$value' WHERE id='$id'";
  } elseif (isset($_POST["edit_description"])) {
    $description = $_POST["description"];
    $sql = "UPDATE yourmood.settings SET description='$description' WHERE id='$id'";
  }
  include("../../sql.php");
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully edited setting.";
  header("location: .");
