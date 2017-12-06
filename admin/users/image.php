<?php

  $allowNormal = true;
  header('Content-Type: image/png');
  include("../../assets/php/sql.php");
  include("../assets/php/user.php");

  $id = @$_GET["id"];
  $query = @$mysqli->query("SELECT * FROM yourmood.users WHERE id = '{$id}'");
  $file = @$query->fetch_object()->image;

  if (isset($_GET["id"]) && $query->num_rows && $file && file_exists("../uploads/images/user/" . $file)) {
    $image = imagecreatefrompng("../uploads/images/user/" . $file);
  } else {
    $image = imagecreatefrompng("../uploads/images/user/placeholder.png");
  }

  imagepng($image);
  imagedestroy($image);
