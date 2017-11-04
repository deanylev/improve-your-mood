<?php

  header("Access-Control-Allow-Origin: *");
  include("../../../assets/php/sql.php");

  @session_start();

  if (isset($_COOKIE["user"])) {
    $_SESSION["user"] = $_COOKIE["user"];
  }

  if (isset($_SESSION["user"])) {
    $sessionUser = $_SESSION["user"];
    $userQuery = $mysqli->query("SELECT * FROM yourmood.users WHERE id='{$sessionUser}'");
    $userRow = $userQuery->fetch_assoc();
    $username = $userRow["user"];
    echo $userRow["user"];
  } else {
    echo "no user";
  }
