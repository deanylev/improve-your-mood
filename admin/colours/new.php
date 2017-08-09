<?php

  session_start();
  $id = $_POST["id"];
  $content = strtoupper($_POST["content"]);
  include("../../sql.php");
  $sql = "INSERT INTO yourmood.colours (colour) VALUES ('$content')";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully created colour.";
  header("location: .");
