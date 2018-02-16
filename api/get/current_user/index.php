<?php

  header("Access-Control-Allow-Origin: *");

  include("../../../assets/php/sql.php");
  include("../../../assets/php/cookies.php");

  @session_start();

  if (isset($_COOKIE["user"])) {
    $_SESSION["user"] = decryptCookie($_COOKIE["user"]);
  }

  function checkUser() {
    global $mysqli;
    if (isset($_SESSION["user"])) {
      $userQuery = $mysqli->query("SELECT * FROM yourmood.users WHERE id='{$_SESSION["user"]}'");
      if (!$userQuery->num_rows) {
        unset($_SESSION["user"]);
        setcookie("user", "", time() - 3600, "/");
        checkUser();
        die();
      }
      $userRow = $userQuery->fetch_assoc();
      $user["id"] = $userRow["id"];
      $user["is_admin"] = $userRow["is_admin"] === "1" ? true : false;
      $user["name"] = $userRow["user"];
      $user["settings"] = htmlspecialchars_decode($userRow["app_settings"]);
      header("Content-Type: application/json");
      echo json_encode($user);
    } else {
      echo "no user";
    }
  }

  checkUser();
