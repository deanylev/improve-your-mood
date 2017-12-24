<?php

  $allowNormal = true;
  header('Content-Type: image/png');
  include("../../assets/php/sql.php");
  @include("../assets/php/user.php");

  $id = @$_GET["id"];
  $query = @$mysqli->query("SELECT * FROM yourmood.users WHERE id = '{$id}'");
  $file = @$query->fetch_object()->image;

  list($width, $height) = getimagesize("../uploads/images/user/{$file}");
  $newWidth = $newHeight = isset($_GET["s"]) ? $_GET["s"] : 80;
  $image = imagecreatetruecolor($newHeight, $newWidth);

  if (isset($_GET["id"]) && $query->num_rows && $file && file_exists("../uploads/images/user/{$file}")) {
    $imageFile = imagecreatefrompng("../uploads/images/user/{$file}");
  } else {
    $imageFile = imagecreatefrompng("../uploads/images/user/placeholder.png");
  }

  imagecopyresampled($image, $imageFile, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
  imagealphablending($image, true);
  imagesavealpha($image, true);
  imagepng($image, null, 0);
  imagedestroy($image);
