<?php

  session_start();

  $type = $_GET["type"];
  $id = $_GET["id"];
  $title = $_GET["title"];
  if ($id === $_SESSION["user_id"]) {
    $userPage = true;
  }
  include("../assets/php/header.php");
  $result = $mysqli->query("SELECT * FROM yourmood.${type} WHERE id='${id}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
  }

  if (!in_array("edit", $actions)) {
      warning_handler(null, null);
  }

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
      if ($key !== "id" && $key !== "password"):

?>

    <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
    <textarea id="<?php echo $key; ?>" class="form-control" name="values[<?php echo $key; ?>]"><?php echo $val; ?></textarea><br>

<?php

    endif;
  }

  if ($type === "users"):

?>

    <label for="password">password</label>
    <input type="password" id="password" class="form-control" name="values[password]" placeholder="Unchanged"></input><br>
    <label for="password_confirmation">password confirmation</label>
    <input type="password" id="password_confirmation" class="form-control" name="password_confirmation" placeholder="Unchanged"></input><br>

<?php

    endif;

  restore_error_handler();

  function warning_handler($errno, $errstr)
  {
      global $title;
      global $type;
      $_SESSION["message"]["danger"] = "An error occured.";
      header("location: ../{$title}s?type={$type}");
  }

?>

  <input class="btn btn-lg btn-success" type="submit" name="edit" value="Save">
  <?php if (in_array("view", $actions)): ?>
    <a class="btn btn-lg btn-primary" href="../view?type=<?php echo $type; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Cancel</a>
  <?php else: ?>
    <a class="btn btn-lg btn-primary" href="../<?php echo $title; ?>s?type=<?php echo $type; ?>">Cancel</a>
  <?php endif; ?>
  <?php if (in_array("delete", $actions)): ?>
    <input class="btn btn-lg btn-danger" type="submit" name="delete" value="Delete">
  <?php endif; ?>
</form>

<?php include("../assets/php/footer.php"); ?>
