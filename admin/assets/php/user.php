<?php

  @include_once("../assets/php/sql.php");

  @session_start();

  $sessionUser = $_SESSION["user"];

  $userQuery = $mysqli->query("SELECT * FROM yourmood.users WHERE id='{$sessionUser}'");

  if ($userQuery->num_rows) {
    $userRow = $userQuery->fetch_assoc();
    $userID = $userRow["id"];
    if ($userRow["is_admin"] !== "1" && $type !== "users" && $id !== $userID && basename($_SERVER["PHP_SELF"]) !== "modify.php") {
      header("location: ../edit?type=users&title=user&id={$userID}");
    }
    $currentUser["name"] = $userRow["user"];
    $currentUser["is_admin"] = $userRow["is_admin"];
    $currentUser["read_only"] = $userRow["read_only"];
    $currentUser["items_per_page"] = intval($userRow["items_per_page"]);
  } else {
    header("location: ../logout");
    die();
  }
