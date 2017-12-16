<?php

  $singular = true;
  $title = "config";
  include("../assets/php/header.php");
  $file = fopen("../../assets/php/settings.ini", "r");
  $config = fread($file, filesize("../../assets/php/settings.ini"));
  fclose($file);
  $lineCount = count(file("../../assets/php/settings.ini"));

?>

<h1 class="text-center">Config Editor</h1>
<br>
<form class="container" method="POST" action="config.php">
  <div class="form-group">
    <textarea class="form-control" name="config" rows="<?php echo $lineCount; ?>"><?php echo $config; ?></textarea>
  </div>
  <button class="btn btn-lg btn-danger submit" type="button" data-action="edit" data-confirm="editing your admin config" data-extra="<br><br><b>WARNING:</b> Editing this incorrectly could lock you out of your admin panel. Be very careful." data-class="danger" data-toggle="modal" data-target="#modal">Save</button>
</form>

<?php include("../assets/php/footer.html"); ?>