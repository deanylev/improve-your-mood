<?php

  @include_once("../assets/php/sql.php");

  @session_start();

  $sessionUser = $_SESSION["user"];

  $userQuery = $mysqli->query("SELECT * FROM yourmood.users WHERE id='{$sessionUser}'");

  if ($userQuery->num_rows) {
    $userRow = $userQuery->fetch_assoc();
    if ($userRow["is_admin"] != "1") {
      die("You do not have access to this.");
    }
    $currentUser["name"] = $userRow["user"];
    $currentUser["read_only"] = $userRow["read_only"];
    $currentUser["items_per_page"] = intval($userRow["items_per_page"]);
  } else {
    header("location: ../logout");
    die();
  }
