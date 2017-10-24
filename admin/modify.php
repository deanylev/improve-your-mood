<?php

  if (isset($_SERVER["HTTP_REFERER"])) {
    session_start();
    include("assets/php/force_auth.php");
    $messageType = "success";
    $id = $_POST["id"];
    $table = $_POST["table"];
    $title = $type = $_POST["type"];
    $url = $_SERVER["HTTP_REFERER"];
    include("assets/php/actions.php");
    include("../assets/php/sql.php");

    if (isset($_POST["new"]) && in_array("create", $actions)) {
        $query = "INSERT INTO yourmood.{$table} () VALUES ()";
        $message = "Successfully created {$type}.";
        $goToID = true;
    } elseif (isset($_POST["delete"]) && in_array("delete", $actions)) {
        $query = "DELETE FROM yourmood.{$table} WHERE id='{$id}'";
        $message = "Successfully deleted {$type}.";
        $url = "{$type}s?type={$table}";
        if ($table === "users" && $id === $_SESSION["user"]) {
          $url = "logout";
        }
    } elseif (isset($_POST["deletemultiple"]) && in_array("delete", $actions)) {
        $statement = "";
        foreach($_POST["items"] as $item) {
          $statement .= "id = '{$item}' OR ";
        }
        $statement = substr($statement, 0, -3);
        $query = "DELETE FROM yourmood.{$table} WHERE {$statement}";
        $message = "Successfully deleted multiple {$type}s.";
        $url = "{$type}s?type={$table}";
    } elseif (isset($_POST["edit"]) && in_array("edit", $actions)) {
        $statement = "";
        // Ignore blank password
        if (isset($_POST["values"]["password"]) && !$_POST["values"]["password"]) {
          unset($_POST["values"]["password"]);
        }
        // Don't allow user to set themself as read_only
        if (isset($_POST["values"]["read_only"]) && $_POST["values"]["read_only"] === "1" && $id === $_SESSION["user"]) {
          unset($_POST["values"]["read_only"]);
          $_SESSION["message"]["warning"] = "Can't set self as read_only.";
        }
        foreach ($_POST["values"] as $key => $val) {
            $val = $key === "password" ? md5($val) : $val;
            $statement .= $key . " = '" . addslashes($val) . "',";
        }
        $statement = substr($statement, 0, -1);
        $query = "UPDATE yourmood.{$table} SET {$statement} WHERE id = '{$id}'";
        $message = "Successfully updated {$type}.";
        $url = in_array("view", $actions) ? "view/?type={$table}&title={$type}&id={$id}" : "{$type}s?type={$table}";
        if ($table === "users") {
          $user = $_POST["values"]["user"];
          $result = $mysqli->query("SELECT * FROM yourmood.{$table} WHERE user='{$user}'");
          if ($result->num_rows) {
            $row = $result->fetch_assoc();
          }
          // Minimum password length is 8
          if (isset($_POST["values"]["password"]) && strlen($_POST["values"]["password"]) < 8) {
            $messageType = "danger";
            $message = "Password must be at least 8 characters.";
            $url = $_SERVER['HTTP_REFERER'];
            $query = "";
          }
          // Username can't be blank
          if (isset($_POST["values"]["user"]) && !$_POST["values"]["user"]) {
            $messageType = "danger";
            $message = "Username can't be blank.";
            $url = $_SERVER['HTTP_REFERER'];
            $query = "";
          }
          // Username can't contain spaces
          if (isset($_POST["values"]["user"]) && strpos($_POST["values"]["user"], " ")) {
            $messageType = "danger";
            $message = "Username can't contain spaces.";
            $url = $_SERVER['HTTP_REFERER'];
            $query = "";
          }
          // If the username is taken, or the password doesn't match the confirmation
          if ((isset($row) && $row["id"] !== $id) || isset($_POST["values"]["password"]) && $_POST["values"]["password"] !== $_POST["password_confirmation"]) {
              $messageType = "danger";
              $message = $_POST["values"]["password"] !== $_POST["password_confirmation"] ? "Passwords don't match." : "Username already exists.";
              $url = $_SERVER['HTTP_REFERER'];
              $query = "";
          }
        }
    } elseif (isset($_POST["deleteall"]) && in_array("deleteall", $actions)) {
        $query = "DELETE FROM yourmood.{$table}";
        $message = "Successfully deleted all {$type}s.";
        $url = "{$type}s?type={$table}";
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
      // Generate a random username/password for a new user
      if ($table === "users") {
        $randomUsername = "user_" . uniqid();
        $randomPassword = md5(uniqid());
        $mysqli->query("UPDATE yourmood.{$table} SET user = '{$randomUsername}', password = '{$randomPassword}' WHERE id = '{$newId}'");
        // Make active by default
      } else {
        $mysqli->query("UPDATE yourmood.{$table} SET active = 1 WHERE id = '{$newId}'");
      }
      // Go to the newly created item
      $url = "edit/?type={$table}&title={$type}&id={$newId}";
    }

    $mysqli->close();

    $_SESSION["message"][$messageType] = $message;
    header("location: {$url}");
  } else {
      $_SESSION["message"]["danger"] = "An error occured.";
      header("location: home");
  }
