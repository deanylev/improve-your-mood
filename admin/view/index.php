<?php

  include("../../sql.php");
  $type = $_GET["type"];
  $id = $_GET["id"];
  $sql = "SELECT * FROM yourmood.${type} WHERE id='${id}'";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $title = $_GET["title"];
  include("../assets/php/header.php");
?>

<h1 class="text-center">Edit <?php echo ucwords($title); ?></h1>
<br>

<form class="form-group text-center container" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $type; ?>">
  <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">

<?php

  set_error_handler("warning_handler", E_WARNING);
  foreach ($row as $key => $val) {
      if ($key !== "id"):

?>

    <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
    <textarea id="<?php echo $key; ?>" class="form-control" name="values[<?php echo $key; ?>]"><?php echo $val; ?></textarea><br>

<?php

    endif;
  }
  restore_error_handler();

  function warning_handler($errno, $errstr)
  {
      global $title;
      global $type;
      header("location: ../{$title}s?version={$type}");
  }
?>

  <input class="btn btn-lg btn-success" type="submit" name="edit" value="Save">
  <br><br>
  <input class="btn btn-lg btn-danger" type="submit" name="delete" value="Delete">
</form>

<?php include("../assets/php/footer.php"); ?>
