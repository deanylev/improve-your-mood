<?php

  if (isset($_SESSION["user"])) {


      include("user.php");

      // Create - make a new record

      // View - view an existing record

      // Edit - update an existing record

      // Delete - delete an existing record

      // Delete All - delete all existing records in a table

      if (!$currentUser["read_only"]) {

        if (isset($type)) {
          switch ($type) {
            case "log":
            case "logs":
              $actions = array("view", "delete", "deleteall");
              break;

            case "improve":
            case "decrease":
            case "quote":
            case "quotes":
            case "colour":
            case "colours":
            case "user":
            case "users":
              $actions = array("create", "edit", "delete");
              break;

            default:
              $actions = array("create", "view", "edit", "delete");
              break;
          }
        }

      } else {

          $actions = array("view");

      }

  }
