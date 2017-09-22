<?php

  session_start();
  $id = $_POST["id"];
  $table = $_POST["table"];
  $type = $_POST["type"];
  $url = $_SERVER['HTTP_REFERER'];

  if (isset($_POST["new"])) {
      $sql = "INSERT INTO yourmood.${table} () VALUES ()";
      $message = "Successfully created ${type}";
  } elseif (isset($_POST["delete"])) {
      $sql = "DELETE FROM yourmood.{$table} WHERE id='{$id}'";
      $message = "Successfully deleted ${type}";
      $url = "{$type}s?type=${table}";
  } elseif (isset($_POST["edit"])) {
      $statement = "";
      foreach ($_POST["values"] as $key => $val) {
          $statement .= $key . " = '" . addslashes($val) . "',";
      }
      $statement = substr($statement, 0, -1);
      $sql = "UPDATE yourmood.${table} SET {$statement} WHERE id = '{$id}'";
      $message = "Successfully updated ${type}";
  }


  include("../sql.php");
  if ($conn->query($sql) === false) {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();

  $_SESSION["alert"] = $message;
  header("location: {$url}");
