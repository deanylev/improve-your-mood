<?php

  session_start();
  include("../../assets/php/sql.php");
  $username = $_POST["username"];
  $password = $_POST["password"];
  $passwordConfirmation = $_POST["password_confirmation"];

  $result = $mysqli->query("SELECT * FROM yourmood.users WHERE user='{$username}'");

  if ($username === "") {
    $errors[] = (object) array("username" => "Can't be blank.");
  } elseif ($username !== str_replace(" ", "", $username)) {
    $errors[] = (object) array("username" => "Can't contain spaces.");
  } elseif ($result->num_rows) {
    $errors[] = (object) array("username" => "Already in use.");
  }

  if (strlen($password) < 8) {
    $errors[] = (object) array("password" => "Must be at least 8 characters.");
  }

  if ($password !== $passwordConfirmation) {
    $errors[] = (object) array("password_confirmation" => "Doesn't match password.");
  }


  if (isset($errors)) {
    if (!isset($_POST["no_message"])) {
      $_SESSION["errors"] = $errors;
      header("location: .");
    } else {
      die(json_encode($errors));
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
