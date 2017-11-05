<?php

  header("Access-Control-Allow-Origin: *");
  include("../../assets/php/sql.php");
  include("../../assets/php/cookies.php");

  session_start();

  setcookie("user", "", time() - 3600, "/");

  if (!isset($_COOKIE["login_attempts"])) {
    setcookie("login_attempts", 0, time() + 600, "/");
    $_COOKIE["login_attempts"] = 0;
  }

  $authUser = $_POST["user"];
  $authPass = $_POST["password"];

  $result = $mysqli->query("SELECT * FROM yourmood.users WHERE user='{$authUser}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
  }

  if ($_COOKIE["login_attempts"] >= 10) {
    echo "Too many login attempts. Try again in 10 minutes.";
  } elseif (isset($row) && md5($authPass) === $row["password"]) {
      setcookie("login_attempts", "", time() - 3600, "/");
      echo "success";
      $_SESSION["user"] = $row["id"];
      if (!isset($_POST["no_message"])) {
        $_SESSION["message"]["success"] = "Logged in successfully.";
      }
      if (isset($_POST["remember"])) {
        setcookie("user", encryptCookie($row["id"]), time() + (86400 * 30), "/");
      }
  } else {
      setcookie("login_attempts", $_COOKIE["login_attempts"] + 1, time() + 600, "/");
      echo "Invalid credentials.";
  }
