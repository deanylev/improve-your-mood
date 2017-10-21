<?php

  include("../../assets/php/sql.php");

  session_start();

  $result = $mysqli->query("SELECT * FROM yourmood.users WHERE user='{$_POST["user"]}'");
  if ($result->num_rows && $result->fetch_assoc()["id"] !== $_POST["id"]) {
    echo "exists";
  }
