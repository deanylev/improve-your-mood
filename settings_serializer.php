<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");

  include("sql.php");

  $sql = "SELECT * FROM yourmood.settings WHERE `active` = 1";
  $result = $conn->query($sql);

  $settings = (object)array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $key = $row["setting"];
          $object = (object)array();
          $object->value = $row["value"];
          $object->label = $row["label"];
          $object->description = $row["description"];
          $object->user = $row["user"];
          $object->advanced = $row["advanced"];
          $object->mobile = $row["mobile"];
          $object->input = $row["input"];
          $settings->$key = $object;
      }
  }

  echo json_encode($settings);

  $conn->close();
