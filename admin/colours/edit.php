<?php

  session_start();
  $id = $_POST["id"];
  $content = strtoupper($_POST["content"]);
  include("../../sql.php");
  $sql = "UPDATE yourmood.colours SET colour='$content' WHERE id='$id'";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully edited colour.";
  header("location: .");
