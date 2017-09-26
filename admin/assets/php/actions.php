<?php

// Create - make a new record

// View - view an existing record

// Edit - update an existing record

// Delete - delete an existing record

// Delete All - delete all existing records in a table

switch ($title) {
  case "log":
    $actions = array("view", "delete", "deleteall");
    break;

  case "quote":
    $actions = array("create", "edit", "delete");
    break;

  case "colour":
    $actions = array("create", "edit", "delete");
    break;

  default:
    $actions = array("create", "view", "edit", "delete");
    break;
}
