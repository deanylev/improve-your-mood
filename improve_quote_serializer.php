<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("sql.php");

  $mysql->query = "SELECT * FROM yourmood.improve WHERE `active` = 1";
  $result = $mysql->result();

  $quotes = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $quotes[] = $row["quote"];
      }
  }

  echo json_encode($quotes);

  $conn->close();
