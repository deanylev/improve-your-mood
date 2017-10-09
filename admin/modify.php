<?php

  session_start();
  include("assets/php/force_auth.php");
  $messageType = "success";
  $id = $_POST["id"];
  $table = $_POST["table"];
  $title = $type = $_POST["type"];
  $url = $_SERVER['HTTP_REFERER'];
  include("assets/php/actions.php");
  include("../assets/php/sql.php");

  if (isset($_POST["new"]) && in_array("create", $actions)) {
      $query = "INSERT INTO yourmood.${table} () VALUES ()";
      $message = "Successfully created ${type}.";
      $goToID = true;
  } elseif (isset($_POST["delete"]) && in_array("delete", $actions)) {
      $query = "DELETE FROM yourmood.{$table} WHERE id='{$id}'";
      $message = "Successfully deleted ${type}.";
      $url = "{$type}s?type=${table}";
      if ($table === "users" && $id === $_SESSION["user_id"]) {
        $url = "logout";
      }
  } elseif (isset($_POST["edit"]) && in_array("edit", $actions)) {
      $statement = "";
      if (isset($_POST["values"]["password"]) && !$_POST["values"]["password"]) {
        unset($_POST["values"]["password"]);
      }
      foreach ($_POST["values"] as $key => $val) {
          $val = $key === "password" ? md5($val) : $val;
          $statement .= $key . " = '" . addslashes($val) . "',";
      }
      $statement = substr($statement, 0, -1);
      $query = "UPDATE yourmood.${table} SET {$statement} WHERE id = '{$id}'";
      $message = "Successfully updated ${type}.";
      $url = in_array("view", $actions) ? "view/?type=${table}&title=${type}&id=${id}" : "{$type}s?type=${table}";
      if ($table === "users") {
        $user = $_POST["values"]["user"];
        $result = $mysqli->query("SELECT * FROM yourmood.${table} WHERE user='${user}'");
        if ($result->num_rows) {
          $row = $result->fetch_assoc();
        }
        if ((isset($row) && $row["id"] !== $id) || isset($_POST["values"]["password"]) && $_POST["values"]["password"] !== $_POST["password_confirmation"]) {
            $messageType = "danger";
            $message = $_POST["values"]["password"] !== $_POST["password_confirmation"] ? "Passwords don't match." : "Username already exists.";
            $url = $_SERVER['HTTP_REFERER'];
            $query = "";
        }
      }
  } elseif (isset($_POST["deleteall"]) && in_array("deleteall", $actions)) {
      $query = "DELETE FROM yourmood.{$table}";
      $message = "Successfully deleted all ${type}s.";
      $url = "{$type}s?type=${table}";
      if ($table === "users") {
        $url = "logout";
      }
  } else {
      $messageType = "danger";
      $message = "An error occured.";
  }

  $mysqli->query($query);
  $newId = $mysqli->insert_id;

  if (isset($goToID)) {
    if ($table === "users") {
      $randomUsername = "user_" . uniqid();
      $blankPassword = md5(uniqid());
      $mysqli->query("UPDATE yourmood.${table} SET user = '${randomUsername}', password = '{$blankPassword}' WHERE id = '{$newId}'");
    }
    $url = "edit/?type=${table}&title=${type}&id=${newId}";
  }

  $mysqli->close();

  $_SESSION["message"][$messageType] = $message;
  header("location: {$url}");
