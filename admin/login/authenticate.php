<?php

  include("../../assets/php/sql.php");

  session_start();

  $authUser = $_POST["user"];
  $authPass = $_POST["password"];

  $result = $mysqli->query("SELECT * FROM yourmood.users WHERE user='{$authUser}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
  }

  if (isset($row) && md5($authPass) === $row["password"]) {
      echo "success";
      $_SESSION["user"] = $row["id"];
      $_SESSION["message"]["success"] = "Logged in successfully.";
  } else {
      echo "fail";
  }
