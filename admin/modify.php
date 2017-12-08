<?php

  if (isset($_SERVER["HTTP_REFERER"])) {
    session_start();
    include("assets/php/force_auth.php");
    $messageType = "success";
    $id = $_POST["id"];
    $table = $_POST["table"];
    $title = $type = $_POST["type"];
    $url = $_SERVER["HTTP_REFERER"];
    include("assets/php/user.php");
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
        if ($table === "users" && $id == $_SESSION["user"]) {
          $url = "logout";
        }
    } elseif (isset($_POST["deletemultiple"]) && in_array("delete", $actions)) {
        $statement = "";
        $length = sizeof($_POST["items"]);
        foreach($_POST["items"] as $item) {
          $statement .= "id = '{$item}' OR ";
        }
        $statement = substr($statement, 0, -3);
        $query = "DELETE FROM yourmood.{$table} WHERE {$statement}";
        $phrase = $length === 1 ? $type : "{$length} {$type}s";
        $message = "Successfully deleted {$phrase}.";
        $url = "{$type}s?type={$table}";
    } elseif (isset($_POST["edit"]) && in_array("edit", $actions)) {
        $statement = "";
        // Ignore blank password
        if (isset($_POST["values"]["password"]) && !$_POST["values"]["password"]) {
          unset($_POST["values"]["password"]);
        }
        // Don't allow user to change their own read_only value
        if (isset($_POST["values"]["read_only"]) && $id == $_SESSION["user"]) {
          unset($_POST["values"]["read_only"]);
        }
        // Don't allow user to change their own is_admin value
        if (isset($_POST["values"]["is_admin"]) && $id == $_SESSION["user"]) {
          unset($_POST["values"]["is_admin"]);
        }
        // Turn blank app settings into empty object
        if (isset($_POST["values"]["app_settings"]) && $_POST["values"]["app_settings"] === "") {
          $_POST["values"]["app_settings"] = "{}";
        }
        // Don't allow editing of created_at
        if (isset($_POST["values"]["created_at"])) {
          unset($_POST["values"]["created_at"]);
        }
        // Don't allow editing of created_by
        if (isset($_POST["values"]["created_by"])) {
          unset($_POST["values"]["created_by"]);
        }
        // Construct SQL statement
        foreach ($_POST["values"] as $key => $val) {
            //$val = $key === "password" ? md5($val) : htmlspecialchars($val);
            switch ($key) {
              case "password":
                $val = md5($val);
                break;

              case "image":
                $val = str_replace("\\", "/", $val);
                $val = basename($val);
                break;

              default:
                $val = htmlspecialchars($val);
                break;
            }
            $statement .= $key . " = '" . addslashes($val) . "',";
        }
        $statement = substr($statement, 0, -1);
        $query = "UPDATE yourmood.{$table} SET {$statement} WHERE id = '{$id}'";
        $message = "Successfully updated {$type}.";
        if ($currentUser["is_admin"]) {
          $url = in_array("view", $actions) ? "view/?type={$table}&title={$type}&id={$id}" : "{$type}s?type={$table}";
        }
        if ($table === "users") {
          $user = $_POST["values"]["user"];
          $result = $mysqli->query("SELECT * FROM yourmood.{$table} WHERE user='{$user}'");
          if ($result->num_rows) {
            $row = $result->fetch_assoc();
          }
          if (isset($_POST["values"]["items_per_page"]) && (intval($_POST["values"]["items_per_page"]) < 1 || intval($_POST["values"]["items_per_page"]) > 50000)) {
            $errors[] = (object) array("items_per_page" => "Must be between 1 and 50,000.");
          }
          if (!$_POST["values"]["user"] === "") {
            $errors[] = (object) array("user" => "Can't be blank.");
          } elseif ($_POST["values"]["user"] !== str_replace(" ", "", $_POST["values"]["user"])) {
            $errors[] = (object) array("user" => "Can't contain spaces.");
          } elseif ((isset($row) && $row["id"] !== $id)) {
            $errors[] = (object) array("user" => "Already in use.");
          }
          if (!json_decode($_POST["values"]["app_settings"])) {
            $errors[] = (object) array("app_settings" => "Must be a valid JSON object.");
          }
          if (isset($_POST["values"]["password"]) && strlen($_POST["values"]["password"]) < 8) {
            $errors[] = (object) array("password" => "Must be at least 8 characters.");
          }
          if (isset($_POST["values"]["password"]) && $_POST["values"]["password"] !== $_POST["password_confirmation"]) {
            $errors[] = (object) array("password_confirmation" => "Doesn't match password.");
          }
          if ((isset($_POST["values"]["is_admin"]) || isset($_POST["values"]["read_only"])) && !$_POST["values"]["is_admin"] && $_POST["values"]["read_only"]) {
            $errors[] = (object) array("read_only" => "Must be admin to be read_only.");
          }
          // Delete unused image
          $currentImage = $mysqli->query("SELECT * FROM yourmood.users WHERE id='{$id}'")->fetch_object()->image;
          @unlink("uploads/images/user/{$currentImage}");
        } elseif ($table === "settings") {
            $setting = $_POST["values"]["setting"];
            $value = $_POST["values"]["value"];
            $input = $_POST["values"]["input"];
            $label = $_POST["values"]["label"];
            $validInputs = array("text", "number", "range", "checkbox", "radio", "chips", "switch", "select");
            $result = $mysqli->query("SELECT * FROM yourmood.{$table} WHERE setting='{$setting}'");
            if ($result->num_rows) {
              $row = $result->fetch_assoc();
            }
            if ($setting === "") {
              $errors[] = (object) array("setting" => "Can't be blank.");
            }
            if ((isset($row) && $row["id"] !== $id)) {
              $errors[] = (object) array("setting" => "Already in use.");
            }
            unset($row);
            $result = $mysqli->query("SELECT * FROM yourmood.{$table} WHERE label='{$label}'");
            if ($result->num_rows) {
              $row = $result->fetch_assoc();
            }
            if ($value === "") {
              $errors[] = (object) array("value" => "Can't be blank.");
            } elseif ($_POST["values"]["user"]) {
              if ($input === "chips" && !json_decode($value)) {
                $errors[] = (object) array("value" => "Must be a valid array.");
              } elseif (($input === "number" || $input === "range") && !is_numeric($value)) {
                $errors[] = (object) array("value" => "Must be a numeric value.");
              } else if (($input === "checkbox" || $input === "switch") && $value !== "false" && $value !== "true") {
                $errors[] = (object) array("value" => "Must be a boolean value.");
              }
            }
            if ($_POST["values"]["user"]) {
              if ($label === "") {
                $errors[] = (object) array("label" => "Can't be blank, as it will be accessible to the user.");
              } elseif (isset($row) && $row["id"] !== $id) {
                $errors[] = (object) array("label" => "Already in use.");
              }
              if ($input === "") {
                $errors[] = (object) array("input" => "Can't be blank, as it will be accessible to the user.");
              } elseif (!in_array($input, $validInputs)) {
                $inputString = implode(", ", $validInputs);
                $errors[] = (object) array("input" => "Must be one of: {$inputString}.");
              }
              if ($_POST["values"]["tab"] === "") {
                $errors[] = (object) array("tab" => "Can't be blank, as it will be accessible to the user.");
              }
              if ($_POST["values"]["description"] === "") {
                $errors[] = (object) array("description" => "Can't be blank, as it will be accessible to the user.");
              }
            }
            if ($_POST["values"]["options"] && !json_decode($_POST["values"]["options"])) {
              $errors[] = (object) array("options" => "Must be a valid object or array.");
            }
            if ($input === "range") {
              if ($_POST["values"]["min"] < 0) {
                $errors[] = (object) array("min" => "Must be 0 or higher.");
              }
              if ($_POST["values"]["max"] < 0) {
                $errors[] = (object) array("max" => "Must be 0 or higher.");
              }
              if ($_POST["values"]["min"] >= $_POST["values"]["max"]) {
                $errors[] = (object) array("min" => "Must be lower than max.");
                $errors[] = (object) array("max" => "Must be higher than min.");
              }
            }
        } elseif ($table === "colours") {
            $colour = $_POST["values"]["colour"];
            if (!(ctype_xdigit($colour) && (strlen($colour) === 6 || strlen($colour) === 3))) {
              $errors[] = (object) array("colour" => "Must be a valid hex code.");
            }
        }

        // Provide errors to AJAX call
        if (isset($_POST["no_message"]) && isset($errors)) {
          die(json_encode($errors));
        }
    } elseif (isset($_POST["deleteall"]) && in_array("deleteall", $actions)) {
        $query = "DELETE FROM yourmood.{$table}";
        $message = "Successfully deleted all {$type}s.";
        $url = "{$type}s?type={$table}";
        if ($table === "users") {
          $url = "logout";
        }
    } elseif (isset($_POST["clone"]) && in_array("clone", $actions)) {
        $columns = $mysqli->query("DESCRIBE yourmood.{$table}");
        $list = "";
        while ($row = $columns->fetch_assoc()) {
          if ($row["Field"] !== "id") {
            $list .= $row["Field"] . ",";
          }
        }
        $list = substr($list, 0, -1);
        $query = "INSERT INTO yourmood.{$table} ($list) (SELECT $list FROM yourmood.{$table} WHERE id = '$id')";
        $message = "Successfully cloned {$type}.";
        $goToID = true;
    } else {
        $messageType = "danger";
        $message = "An error occured. (003)";
    }

    if (!isset($errors)) {
      $mysqli->query($query);
    }

    $newId = $mysqli->insert_id;

    if (isset($goToID)) {
      // Go to the newly created item
      $page = in_array("edit", $actions) ? "edit" : "view";
      $url = "{$page}/?type={$table}&title={$type}&id={$newId}";
      // Set the created_by
      $createdBy = $_SESSION["user"];
      $mysqli->query("UPDATE yourmood.{$table} SET created_by = '{$createdBy}' WHERE id = '{$newId}'");
    }

    $dateNow = date("Y-m-d H:i:s");

    if (isset($_POST["new"]) && in_array("create", $actions)) {
      if ($table === "users") {
        // Generate a random username/password for a new user
        $randomUsername = "user_" . uniqid();
        $randomPassword = md5(uniqid());
        $mysqli->query("UPDATE yourmood.{$table} SET user = '{$randomUsername}', password = '{$randomPassword}' WHERE id = '{$newId}'");
      } elseif ($table === "colours") {
        // Default black colour
        $mysqli->query("UPDATE yourmood.{$table} SET colour = '000000' WHERE id = '{$newId}'");
      } elseif ($table === "settings") {
        // Random setting name
        $randomSettingName = "setting_" . uniqid();
        $randomSettingValue = uniqid();
        $mysqli->query("UPDATE yourmood.{$table} SET setting = '{$randomSettingName}', value = '{$randomSettingValue}' WHERE id = '{$newId}'");
      }
      $mysqli->query("UPDATE yourmood.{$table} SET active = 1, created_at = '{$dateNow}' WHERE id = '{$newId}'");
    } elseif (isset($_POST["clone"]) && in_array("clone", $actions)) {
        if ($table === "users") {
          $username = $mysqli->query("SELECT user FROM yourmood.{$table} WHERE id = '{$newId}'")->fetch_object()->user . "_" . uniqid();
          $mysqli->query("UPDATE yourmood.{$table} SET user = '{$username}' WHERE id = '{$newId}'");
        } elseif ($table === "settings") {
          $setting = $mysqli->query("SELECT setting, label FROM yourmood.{$table} WHERE id = '{$newId}'")->fetch_object();
          $settingName = $setting->setting . "_" . uniqid();
          $settingLabel = $setting->label . "_" . uniqid();
          $extra = $setting->label ? ", label = '{$settingLabel}' " : "";
          $mysqli->query("UPDATE yourmood.{$table} SET setting = '{$settingName}'{$extra}WHERE id = '{$newId}'");
        }
        $mysqli->query("UPDATE yourmood.{$table} SET created_at = '{$dateNow}' WHERE id = '{$newId}'");
    }

    $mysqli->close();

    if (isset($errors) && !isset($_POST["no_message"])) {
      $url = $_SERVER["HTTP_REFERER"];
      $_SESSION["errors"] = $errors;
    } else {
      $_SESSION["message"][$messageType] = $message;
      echo "{$url}";
    }

    if (!isset($_POST["no_message"])) {
      header("location: {$url}");
    }
  } else {
      $_SESSION["message"]["danger"] = "An error occured. (004)";
      header("location: home");
  }
