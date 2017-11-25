<?php

  session_start();
  include("../../assets/php/sql.php");
  $username = $_POST["username"];
  $password = $_POST["password"];
  $passwordConfirmation = $_POST["password_confirmation"];

  $reason = false;
  $result = $mysqli->query("SELECT * FROM yourmood.users WHERE user='{$username}'");

  if (!$username) {
    $reason = "Username can't be blank.";
  } elseif (strpos($username, " ")) {
    $reason = "Username can't contain spaces.";
  } elseif ($result->num_rows) {
    $reason = "Username already in use.";
  } elseif (strlen($password) < 8) {
    $reason = "Password must be at least 8 characters.";
  } elseif ($password !== $passwordConfirmation) {
    $reason = "Passwords don't match.";
  }


  if ($reason) {
    if (!isset($_POST["no_message"])) {
      $_SESSION["message"]["danger"] = $reason;
      header("location: .");
    } else {
      echo $reason;
    }
  } else {
    $password = md5($password);
    $mysqli->query("INSERT INTO yourmood.users (user, password) VALUES ('$username', '$password')");
    $_SESSION["user"] = $mysqli->insert_id;
    $mysqli->close();
    if (!isset($_POST["no_message"])) {
      $_SESSION["message"]["success"] = "New user <b>{$username}</b> created successfully.";
    }
    echo "success";
  }
