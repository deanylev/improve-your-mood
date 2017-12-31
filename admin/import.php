<?php

  include("assets/php/user.php");

  if ($currentUser["is_admin"] && !$currentUser["read_only"]) {
    $decrypt = "chocolateMILK";
    $forbiddenKeys = array("table", "id", "created_at", "created_by", "is_owner", "image");
    $uniqueKeys = array("user", "setting", "label");
    $value = $_POST["value"];
    $value = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($decrypt), base64_decode($value), MCRYPT_MODE_CBC, md5(md5($decrypt))), "\0");
    $value = json_decode($value);

    $table = $_POST["table"];
    $type = $_POST["type"];

    $user = $_SESSION["user"];
    $dateNow = date("Y-m-d H:i:s");

    if ($value && $table === $value->table) {
      $keys = "";
      $values = "";

      if ($mysqli->query("SHOW COLUMNS FROM yourmood.{$table} LIKE 'created_at'")->num_rows) {
        $keys .= "created_at,";
        $values .= "'{$dateNow}',";
      }

      if ($mysqli->query("SHOW COLUMNS FROM yourmood.{$table} LIKE 'created_by'")->num_rows) {
        $keys .= "created_by,";
        $values .= "'{$user}',";
      }

      foreach ($value as $key => $val) {
        $val = in_array($key, $uniqueKeys) && $val !== "" && $mysqli->query("SELECT * FROM yourmood.{$table} WHERE {$key} = '{$val}'")->num_rows ? $val . "_" . uniqid() : addslashes($val);
        if (!in_array($key, $forbiddenKeys)) {
          $keys .= "{$key},";
          $values .= "'{$val}',";
        }
      }

      $keys = substr($keys, 0, -1);
      $values = substr($values, 0, -1);

      $mysqli->query("INSERT INTO yourmood.{$table} ($keys) VALUES ($values)");
      $id = $mysqli->insert_id;

      if ($mysqli->query("SELECT * FROM yourmood.{$table} WHERE id = '{$id}'")->num_rows) {
        $_SESSION["message"]["success"] = "Successfully imported {$type}.";
        echo json_encode((object) array("status" => "success", "url" => "../view/?type={$table}&title={$type}&id={$id}"));
      } else {
        echo json_encode((object) array("status" => "An error occured."));
      }
    } else {
      echo json_encode((object) array("status" => "Invalid value."));
    }
  } else {
    die("unauthorised");
  }
