<?php

  header("Access-Control-Allow-Origin: *");
  include("../../assets/php/sql.php");

  session_start();

  setcookie("user", "", time() - 3600, "/");

  $authUser = $_POST["user"];
  $authPass = $_POST["password"];

  $result = $mysqli->query("SELECT * FROM yourmood.users WHERE user='{$authUser}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
  }

  if (isset($row) && md5($authPass) === $row["password"]) {
      echo "success";
      $_SESSION["user"] = $row["id"];
      if (!isset($_POST["no_message"])) {
        $_SESSION["message"]["success"] = "Logged in successfully.";
      }
      if (isset($_POST["remember"])) {
        setcookie("user", $row["id"],  time() + (86400 * 30), "/");
      }
  } else {
      echo "fail";
  }
