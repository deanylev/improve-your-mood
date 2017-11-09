<?php

  session_start();

  $type = $_GET["type"];
  $id = $_GET["id"];
  $title = $_GET["title"];
  $singular = true;
  $action = "view";
  $otherTitle = ucwords($action) . " " . ucwords($title);
  if ($id == $_SESSION["user"]) {
    $userPage = true;
  }
  include("../assets/php/header.php");
  $result = $mysqli->query("SELECT * FROM yourmood.{$type} WHERE id='{$id}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
  }

?>

<h1 class="text-center">View <?php echo $title === "user" && $id == $_SESSION["user"] ? "Your Profile" : ucwords($title); ?></h1>
<br>

<form class="form-group text-center container" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $type; ?>">
  <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">

<?php

  set_error_handler("warning_handler", E_WARNING);
  foreach ($row as $key => $val) {
      if ($key !== "id" && $key !== "password"):

?>

    <p><b><?php echo $key; ?>:</b><br><?php echo $val; ?></p><br>

<?php

    endif;
  }

  restore_error_handler();

  function warning_handler($errno, $errstr)
  {
      global $title;
      global $type;
      $_SESSION["message"]["danger"] = "An error occured.";
      header("location: ../{$title}s?type={$type}");
  }

  if (in_array("edit", $actions)):

?>

  <a class="btn btn-lg btn-warning" href="../edit?type=<?php echo $type; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Edit</a>

<?php

  endif;

  if (in_array("delete", $actions)):

?>

  <button class="btn btn-lg btn-danger submit" type="button" data-action="delete" data-confirm="deleting a <?php echo $title; ?>" data-class="danger" data-toggle="modal" data-target="#modal">Delete</button>

<?php endif; ?>
</form>

<?php include("../assets/php/footer.html"); ?>
