<?php

switch ($title) {
  case "log":
    $actions = array("view", "delete");
    break;

  default:
    $actions = array("create", "view", "edit", "delete");
    break;
}
