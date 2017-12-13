<?php

  session_start();

  include("../../assets/php/sql.php");
  include("../../assets/php/settings.php");

  $username = $_POST["username"];
  $password = $_POST["password"];
  $passwordConfirmation = $_POST["password_confirmation"];
  $admin = 0;
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

  if (isset($settings["CONFIG"]["admin_signup"]) && $settings["CONFIG"]["admin_signup"] === "1" && isset($settings["CONFIG"]["admin_key"]) && $settings["CONFIG"]["admin_key"] && isset($_POST["admin_key"]) && $_POST["admin_key"] !== "") {
    if ($_POST["admin_key"] === $settings["CONFIG"]["admin_key"]) {
      $admin = 1;
    } else {
      $errors[] = (object) array("admin_key" => "Incorrect.");
    }
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
    $mysqli->query("INSERT INTO yourmood.users (is_admin, user, password) VALUES ('$admin','$username', '$password')");
    $user = $_SESSION["user"] = $mysqli->insert_id;
    $dateNow = date("Y-m-d H:i:s");
    $mysqli->query("INSERT INTO yourmood.sessions (user, created_at) VALUES ('$user', '$dateNow')");
    $_SESSION["id"] = $mysqli->insert_id;
    $mysqli->close();
    if (!isset($_POST["no_message"])) {
      $_SESSION["message"]["success"] = "New user <b>{$username}</b> created successfully.";
    }
    echo "success";
  }
