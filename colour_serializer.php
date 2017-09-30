<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("sql.php");

  $mysql->query = "SELECT * FROM yourmood.colours WHERE `active` = 1";
  $result = $mysql->result();

  $colours = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $colours[] = $row["colour"];
      }
  }

  echo json_encode($colours);

  $mysql->disconnect();
