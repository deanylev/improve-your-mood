<?php

  header('Content-Type: image/png');
  include("../../assets/php/sql.php");
  include("../assets/php/user.php");

  $id = $_GET["id"];
  $file = $mysqli->query("SELECT image FROM yourmood.users WHERE id = '{$id}'")->fetch_object()->image;

  if ($file && file_exists("../uploads/images/user/" . $file)) {
    $image = imagecreatefrompng("../uploads/images/user/" . $file);
  } else {
    $image = imagecreatefrompng("../uploads/images/user/placeholder.png");
  }

  imagepng($image);
  imagedestroy($image);
