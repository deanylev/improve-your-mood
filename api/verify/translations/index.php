<?php

 header("Access-Control-Allow-Origin: *");

 include("../../../assets/php/sql.php");

 $query = $mysqli->query("SELECT * FROM yourmood.settings WHERE setting = 'translation_languages'");

 if ($query->num_rows) {
  echo md5($query->fetch_object()->value);
} else {
  echo "none";
}
