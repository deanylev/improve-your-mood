<?php

  include(dirname(__FILE__) . "../../../../assets/php/cookies.php");
  include(dirname(__FILE__) . "../../../../assets/php/sql.php");

  if (isset($_SESSION["id"])) {
    $session = $_SESSION["id"];
  }

  if (isset($_SESSION["user"]) && $mysqli->query("SELECT * FROM yourmood.sessions WHERE id = '$session' AND valid = 1")->num_rows) {
    header("location: ../home");
  }
