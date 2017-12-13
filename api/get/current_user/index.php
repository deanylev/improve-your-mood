<?php

  header("Access-Control-Allow-Origin: *");

  include("../../../assets/php/sql.php");
  include("../../../assets/php/cookies.php");

  @session_start();

  if (isset($_COOKIE["user"])) {
    $cookie = $_COOKIE["user"];
  }

  if (isset($cookie) && $mysqli->query("SELECT * FROM yourmood.sessions WHERE user = '$cookie' AND valid = 1")->num_rows) {
    $user = $_SESSION["user"] = decryptCookie($_COOKIE["user"]);
    $dateNow = date("Y-m-d H:i:s");
    $mysqli->query("INSERT INTO yourmood.sessions (user, created_at) VALUES ('$user', '$dateNow')");
    $_SESSION["id"] = $mysqli->insert_id;
  }

  $session = $_SESSION["id"];

  if (isset($_SESSION["user"]) && $mysqli->query("SELECT * FROM yourmood.sessions WHERE id = '$session' AND valid = 1")->num_rows) {
    $sessionUser = $_SESSION["user"];
    $userQuery = $mysqli->query("SELECT * FROM yourmood.users WHERE id='{$sessionUser}'");
    $userRow = $userQuery->fetch_assoc();
    $currentUser["id"] = $userRow["id"];
    $currentUser["name"] = $userRow["user"];
    $currentUser["settings"] = htmlspecialchars_decode($userRow["app_settings"]);
    header("Content-Type: application/json");
    echo json_encode($currentUser);
  } else {
    echo "no user";
  }
