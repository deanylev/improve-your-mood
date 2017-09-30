<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("sql.php");

  $mysql->query = "SELECT * FROM yourmood.settings WHERE `active` = 1";
  $result = $mysql->result();

  $settings = (object)array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $key = $row["setting"];
          $object = (object)array();
          foreach ($row as $rowKey => $rowVal) {
              if ($rowKey !== "id" && $rowKey !== "active") {
                  $object->{$rowKey} = $rowVal;
              }
          }
          $settings->$key = $object;
      }
  }

  echo json_encode($settings);

  $mysql->disconnect();
