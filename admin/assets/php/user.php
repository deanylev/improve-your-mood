<?php

  @include_once("../assets/php/sql.php");

  @session_start();

  $sessionUser = $_SESSION["user"];

  $userQuery = $mysqli->query("SELECT * FROM yourmood.users WHERE id='{$sessionUser}'");

  if ($userQuery->num_rows) {
    $userRow = $userQuery->fetch_assoc();
    $currentUser["name"] = $userRow["user"];
    $currentUser["read_only"] = $userRow["read_only"];
  } else {
    header("location ../logout");
    die();
  }
