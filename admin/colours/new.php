<?php

  session_start();
  $content = strtoupper($_POST["content"]);
  include("../../sql.php");
  $sql = "INSERT INTO yourmood.colours (active, colour) VALUES (1, '$content')";
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();
  $_SESSION["alert"] = "Successfully created colour.";
  header("location: .");
