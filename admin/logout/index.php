<?php

  header("Access-Control-Allow-Origin: *");
  include("../../assets/php/sql.php");
  session_start();
  $user = $_SESSION["user"];
  unset($_SESSION["user"]);
  $selector = isset($_GET["everywhere"]) ? "user = '{$user}'" : "id = {$session}";
  $session = $_SESSION["id"];
  $mysqli->query("UPDATE yourmood.sessions SET valid = 0 WHERE {$selector}");
  setcookie("user", "", time() - 3600, "/");
  if (!isset($_POST["no_message"])) {
    $_SESSION["message"]["success"] = "Logged out successfully.";
  }
  header("location: ../login");
