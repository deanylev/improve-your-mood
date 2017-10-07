<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("sql.php");

  $result = $mysqli->query("SELECT * FROM yourmood.{$table} WHERE `active` = 1");

  $array = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $array[] = $row[$field];
      }
  }

  echo json_encode($array);

  $mysqli->close();
