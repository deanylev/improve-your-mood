<?php

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
