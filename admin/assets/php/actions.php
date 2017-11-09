<?php

  if (isset($_SESSION["user"])) {
    include("user.php");

    // Create - make a new record

    // View - view an existing record

    // Edit - update an existing record

    // Delete - delete an existing record

    // Delete All - delete all existing records in a table

    if (isset($type)) {
      if (!$currentUser["is_admin"]) {
        $actions = array("edit");
      } elseif (!$currentUser["read_only"]) {
        switch ($type) {
          case "log":
          case "logs":
            $actions = array("view", "delete", "deleteall");
            break;

          case "user":
          case "users":
            $actions = array("create", "edit", "delete");
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
    }
  }
