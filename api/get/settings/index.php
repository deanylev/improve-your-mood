<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("../../../assets/php/sql.php");

  $result = $mysqli->query("SELECT * FROM yourmood.settings WHERE `active` = 1 ORDER BY tab, position ASC");

  $settings = (object)array();

  $forbiddenKeys = array("id", "active", "setting", "notes", "created_at", "created_by", "position");

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $key = $row["setting"];
          $object = (object)array();
          foreach ($row as $rowKey => $rowVal) {
              if (!in_array($rowKey, $forbiddenKeys)) {
                  $object->{$rowKey} = htmlspecialchars_decode($rowVal);
              }
          }
          $settings->$key = $object;
      }
  }

  echo json_encode($settings);

  $mysqli->close();
