<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("sql.php");

  $sql = "SELECT * FROM yourmood.decrease WHERE `active` = 1";
  $result = $conn->query($sql);

  $quotes = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $quotes[] = $row["quote"];
      }
  }

  echo json_encode($quotes);

  $conn->close();
