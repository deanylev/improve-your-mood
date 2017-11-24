<?php

  session_start();
  include("../../assets/php/sql.php");
  $username = $_POST["username"];
  $password = $_POST["password"];
  $passwordConfirmation = $_POST["password_confirmation"];

  $userExists = false;
  $result = $mysqli->query("SELECT * FROM yourmood.users WHERE user='{$username}'");
  if ($result->num_rows) {
    $userExists = true;
  }


  if (!$userExists && $username && $password === $passwordConfirmation && strlen($password) >= 8 && !strpos($username, " ")) {
    $password = md5($password);
    $mysqli->query("INSERT INTO yourmood.users (user, password) VALUES ('$username', '$password')");
    $_SESSION["user"] = $mysqli->insert_id;
    $mysqli->close();
    if (!isset($_POST["no_message"])) {
      $_SESSION["message"]["success"] = "New user <b>{$username}</b> created successfully.";
    }
    echo "success";
  } else {
    if (!isset($_POST["no_message"])) {
      $_SESSION["message"]["danger"] = "Validation errors. Please enable JavaScript.";
    }
    echo "Validation errors.";
  }
