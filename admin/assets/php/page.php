<?php

  include("header.php");

  !isset($actions) ? $actions = array("create", "view", "edit", "delete") : "";

?>

<h1 class="text-center"><?php echo ucwords($title); ?>s</h1>

<form class="container" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $table; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">
  <?php if (in_array("create", $actions)): ?>
    <input class="btn btn-lg btn-primary" type="submit" name="new" value="New <?php echo ucwords($title); ?>">
  <?php endif; ?>
  <br><br>
</form>

<table class="table table-striped">
  <thead>
    <tr>
      <?php if (!isset($notDefault)): ?>
        <th><?php echo ucwords($title); ?></th>
      <?php endif; ?>
      <?php echo isset($customHeadings) ? $customHeadings : ""; ?>
      <?php if (in_array("edit", $actions) || in_array("delete", $actions)): ?>
        <th>Actions</th>
      <?php endif; ?>
    </tr>
  </thead>
  <tbody>

<?php

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()):

?>

    <tr>
      <?php if (!isset($notDefault)): ?>
        <td><p><?php echo $row[$title]; ?></p></td>
      <?php endif; ?>
      <?php isset($customFields) ? include($customFields) : ""; ?>
      <td>
        <form action="../modify.php" method="POST">
          <?php if (in_array("view", $actions)): ?>
            <a class="btn btn-success" href="../view?type=<?php echo $table; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">View</a>
          <?php endif; ?>
          <?php if (in_array("edit", $actions)): ?>
            <a class="btn btn-warning" href="../edit?type=<?php echo $table; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Edit</a>
          <?php endif; ?>
          <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
          <input type="hidden" name="table" value="<?php echo $table; ?>">
          <input type="hidden" name="type" value="<?php echo $title; ?>">
          <?php if (in_array("delete", $actions)): ?>
            <input class="btn btn-danger" type="submit" name="delete" value="Delete">
          <?php endif; ?>
        </form>
      </td>
    </tr>

<?php

    endwhile;
  }

?>
  </tbody>
</table>

<?php include("footer.php"); ?>
