<?php

  session_start();
  $id = $_POST["id"];
  include("../../sql.php");
  $sql = "DELETE FROM yourmood.decrease WHERE id = '$id'";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully deleted quote.";
  header("location: .");
