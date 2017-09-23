<?php include("header.php"); ?>

<h1 class="text-center"><?php echo ucwords($title); ?>s</h1>

<form class="container" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $table; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">
  <input class="btn btn-lg btn-primary" type="submit" name="new" value="New <?php echo ucwords($title); ?>">
  <br><br>
</form>

<table class="table table-striped">
  <thead>
    <tr>
      <th><?php echo ucwords($title); ?></th>
      <?php echo isset($customHeadings) ? $customHeadings : ""; ?>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>

<?php

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()):

?>

    <tr>
      <td><p><?php echo $row[$title]; ?></p></td>
      <?php isset($customFields) ? include($customFields) : ""; ?>
      <td>
        <form action="../modify.php" method="POST">
          <a class="btn btn-success" href="../view?type=<?php echo $table; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">View</a>
          <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
          <input type="hidden" name="table" value="<?php echo $table; ?>">
          <input type="hidden" name="type" value="<?php echo $title; ?>">
          <input class="btn btn-danger" type="submit" name="delete" value="Delete">
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
