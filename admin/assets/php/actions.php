<?php

  if (isset($_SESSION["user"])) {
    include("user.php");

    // ** DEFAULT **

    // Create - make a new record
    // View - view an existing record
    // Edit - update an existing record
    // Delete - delete an existing record

    // ** ADDITIONAL **

    // Clone - make a copy of an existing record
    // Delete All - delete all existing records in a table

    if (isset($type)) {
      if ($currentUser["is_admin"]) {
        if (!$currentUser["read_only"]) {
          switch ($type) {
            case "log":
            case "logs":
              $actions = array("view", "delete", "deleteall");
              break;

            case "user":
            case "users":
            case "setting":
            case "settings":
              $actions = array("create", "view", "edit", "clone", "delete");
              break;

            default:
              $actions = array("create", "view", "edit", "delete");
              break;
          }
        } elseif (($type === "user" || $type === "users") && isset($id) && $id == $_SESSION["user"]) {
          $actions = array("edit");
        } else {
          $actions = array("view");
        }
      } elseif (($type === "user" || $type === "users") && isset($id) && $id == $_SESSION["user"]) {
        $actions = array("edit");
      } else {
        $actions = array("");
      }
    }
  }
