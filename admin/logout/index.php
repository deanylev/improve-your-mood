<?php

  header("Access-Control-Allow-Origin: *");
  session_start();
  unset($_SESSION["user"]);
  setcookie("user", "", time() - 3600, "/");
  if (!isset($_POST["no_message"])) {
    $_SESSION["message"]["success"] = "Logged out successfully.";
  }
  header("location: ../login");
