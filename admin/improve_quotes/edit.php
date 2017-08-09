<?php

  session_start();
  $id = $_POST["id"];
  $content = $_POST["content"];
  include("../../sql.php");
  $sql = "UPDATE yourmood.improve SET quote='$content' WHERE id='$id'";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully edited quote.";
  header("location: .");
