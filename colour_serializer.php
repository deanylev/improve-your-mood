<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("sql.php");

  $sql = "SELECT * FROM yourmood.colours";
  $result = $conn->query($sql);

  $colours = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $colours[] = $row["colour"];
      }
  }

  echo json_encode($colours);

  $conn->close();
