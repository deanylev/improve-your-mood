<?php

  include("header.php");
  $itemAmounts = array(100, 200, 300, 400, 500, 600, 700, 800, 900, 1000);
  if (!in_array($currentUser["items_per_page"], $itemAmounts)) {
    $itemAmounts[] = $currentUser["items_per_page"];
  }
  if (isset($_GET["items"]) && !in_array(intval($_GET["items"]), $itemAmounts)) {
    $itemAmounts[] = intval($_GET["items"]);
  }
  sort($itemAmounts);
  if (isset($_GET["page"])) {
    $page = isset($_GET["page"]) ? intval($_GET["page"]) : "";
    $totalPages = max(ceil($numRows / $items), 1);
    $offset = $items * ($page - 1);
  }
  $limit = $numRows > $items ? "LIMIT {$offset}, {$items}" : "";
  $sort = $table === "settings" ? "ORDER BY tab, position ASC" : "";
  $result = $mysqli->query("SELECT * FROM yourmood.{$table} {$limit} {$sort}");
  $currentRows = $result->num_rows;
  $dbColumns = $mysqli->query("DESCRIBE yourmood.{$table}");
  $forbiddenKeys = array("id", "active", "log", "localstorage", "password", "position");

?>

<div class="text-center">
  <h1><?php echo ucwords($title); ?>s (<span id="results-number"><?php echo $currentRows; ?></span>/<?php echo $numRows; ?>)</h1>
  <br>
  <span>Items Per Page:</span>
  <select id="items-per-page">
    <?php foreach ($itemAmounts as $amount): ?>
      <option value="<?php echo $amount; ?>" <?php echo $amount == $items ? "selected" : ""; ?>><?php echo $amount; ?></option>
    <?php endforeach; ?>
  </select>
  <br>
  <?php if (isset($page) && $totalPages > 1): ?>
    <br>
    <?php if ($page > 1): ?>
      <a href="?type=<?php echo $type; ?>&amp;page=1&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-double-left"></span></a>
      <a href="?type=<?php echo $type; ?>&amp;page=<?php echo $page - 1; ?>&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-left"></span></a>
    <?php endif; ?>
    <span>&nbsp;Page: <?php echo $page; ?>/<?php echo $totalPages; ?>&nbsp;</span>
    <?php if ($page < $totalPages): ?>
      <a href="?type=<?php echo $type; ?>&amp;page=<?php echo $page + 1; ?>&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-right"></span></a>
      <a href="?type=<?php echo $type; ?>&amp;page=<?php echo $totalPages; ?>&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-double-right"></span></a>
    <?php endif; ?>
  <?php endif; ?>
</div>

<br>

<?php if ($result->num_rows): ?>
  <div class="text-center show-on-load d-none">
    <select name="field">
      <?php while ($row = $dbColumns->fetch_assoc()) { ?>
        <?php $field = $row["Field"]; ?>
        <?php if (!in_array($field, $forbiddenKeys)): ?>
          <option value="<?php echo $field; ?>" <?php echo ($field === $title && !isset($_GET["f"])) || (isset($_GET["f"]) && $_GET["f"] === $field) ? "selected" : ""; ?>><?php echo $field; ?></option>
        <?php endif; ?>
      <?php } ?>
    </select>
    <select name="query">
      <option value="contains" <?php echo isset($_GET["q"]) && $_GET["q"] === "contains" ? "selected" : ""; ?>>contains</option>
      <option value="equals" <?php echo isset($_GET["q"]) && $_GET["q"] === "equals" ? "selected" : ""; ?>>equals</option>
      <option value="startswith" <?php echo isset($_GET["q"]) && $_GET["q"] === "startswith" ? "selected" : ""; ?>>starts with</option>
      <option value="endswith" <?php echo isset($_GET["q"]) && $_GET["q"] === "endswith" ? "selected" : ""; ?>>ends with</option>
    </select>
    <input id="search-bar" type="text" name="search" placeholder="search" value="<?php echo isset($_GET["s"]) ? $_GET["s"] : ""; ?>">
    <br><br>
    <input id="case-sensitive" type="checkbox" <?php echo isset($_GET["c"]) && $_GET["c"] === "true" ? "checked" : ""; ?>>
    <label>Case Sensitive?</label>
  </div>
<?php endif; ?>

<br>

<form class="container show-on-load d-none" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $table; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">
  <?php if (in_array("create", $actions)): ?>
    <button class="btn btn-lg btn-primary submit" type="button" data-action="new" data-undo="true" data-confirm="creating a new <?php echo $title; ?>" data-class="primary" data-toggle="modal" data-target="#modal">New <?php echo ucwords($title); ?></button>
    <button id="import-button" class="btn btn-lg btn-dark" type="button">Import <?php echo ucwords($title); ?></button>
    <input id="import-field" class="d-none" type="text" placeholder="Paste export code">
    <button id="submit-import" class="btn btn-dark d-none" type="button" data-table="<?php echo $table; ?>" data-type="<?php echo $title; ?>">Submit<i class="d-none fa fa-spinner fa-pulse fa-fw"></i></button>
    <span id="import-response" class="text-danger"></span>
  <?php endif; ?>
  <button id="delete-selected-button" class="btn btn-lg btn-danger submit d-none" type="button" data-title="<?php echo $title; ?>" data-action="deletemultiple" data-class="danger" data-toggle="modal" data-target="#modal">Delete Selected <?php echo ucwords($title); ?>s (<span id="selected-number"></span>)</button>
  <?php if (in_array("deleteall", $actions) && $result->num_rows): ?>
    <button class="btn btn-lg btn-danger submit" type="button" data-action="deleteall" data-confirm="deleting all <?php echo $title; ?>s" data-class="danger" data-toggle="modal" data-target="#modal">Delete All <?php echo ucwords($title); ?>s</button>
  <?php endif; ?>
  <br><br>
</form>
<section class="section pre-loader">
    <span class="loader loader1"></span>
    Loading...
</section>
<form id="main-form" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $table; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">
  <div class="table-responsive">
    <table class="table table-striped show-on-load d-none" data-type="<?php echo $type; ?>">
      <thead>
        <tr>
          <?php if (!$currentUser["read_only"]): ?>
            <th><input id="select-all-checkbox" type="checkbox"></th>
          <?php endif; ?>
          <?php if (!isset($notDefault)): ?>
            <th><?php echo ucwords($title); ?></th>
          <?php endif; ?>
          <?php echo isset($customHeadings) ? $customHeadings : ""; ?>
          <th class="preview d-none">Preview</th>
          <?php if (in_array("edit", $actions) || in_array("delete", $actions)): ?>
            <th class="actions">Actions</th>
          <?php endif; ?>
        </tr>
      </thead>
      <tbody>

    <?php

      if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()):

            $fields = "";

            foreach ($row as $key => $val) {
              if (!in_array($key, $forbiddenKeys) || $key === "id" || $key === "position") {
                if ($key === "created_at" && $val === "0000-00-00 00:00:00") {
                  $val = "unknown";
                } elseif ($key === "created_by") {
                  if ($mysqli->query("SELECT * FROM yourmood.users WHERE id = {$val}")->num_rows) {
                    $val = $mysqli->query("SELECT * FROM yourmood.users WHERE id = '{$val}'")->fetch_object()->user;
                  } else {
                    $val = "unknown";
                  }
                }
                $quote = strpos($val, "\"") ? "'" : "\"";
                $fields .= " data-{$key}={$quote}{$val}{$quote}";
              }
            }

    ?>

        <tr class="item"<?php echo $fields; ?>>
          <?php if (!$currentUser["read_only"]): ?>
            <td><input class="select-checkbox" type="checkbox" name="items[]" value="<?php echo $row["id"]; ?>"></td>
          <?php endif; ?>
          <?php if (!isset($notDefault)): ?>
            <td><p><?php echo $row[$title]; ?><?php echo $title === "user" && $row["id"] == $_SESSION["user"] ? " <b>(you)</b>" : ""; ?></p></td>
          <?php endif; ?>
          <?php isset($customFields) ? include($customFields) : ""; ?>
          <td class="preview d-none"></td>
          <td class="actions">
            <?php if (in_array("view", $actions)): ?>
              <a class="btn btn-success action-button" href="../view?type=<?php echo $table; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">View</a>
            <?php endif; ?>
            <?php if (in_array("edit", $actions) || ($table === "users" && $row["id"] == $_SESSION["user"])): ?>
              <a class="btn btn-warning action-button" href="../edit?type=<?php echo $table; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Edit</a>
            <?php endif; ?>
            <?php if (in_array("clone", $actions)): ?>
              <button class="btn btn-info submit" type="button" data-id="<?php echo $row["id"]; ?>" data-action="clone" data-undo="true" data-confirm="cloning a <?php echo $title; ?>" data-class="info" data-toggle="modal" data-target="#modal">Clone</button>
            <?php endif; ?>
            <?php if (in_array("delete", $actions)): ?>
              <button class="btn btn-danger submit" type="button" data-id="<?php echo $row["id"]; ?>" data-action="delete" data-confirm="deleting a <?php echo $title; ?>" data-class="danger" data-toggle="modal" data-target="#modal">Delete</button>
            <?php endif; ?>
          </td>
        </tr>

    <?php

        endwhile;
      }

    ?>

      </tbody>
    </table>
  </div>
</form>
<div class="text-center">
  <?php if (isset($page) && $totalPages > 1): ?>
    <?php if ($page > 1): ?>
      <a href="?type=<?php echo $type; ?>&amp;page=1&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-double-left"></span></a>
      <a href="?type=<?php echo $type; ?>&amp;page=<?php echo $page - 1; ?>&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-left"></span></a>
    <?php endif; ?>
    <span>&nbsp;Page: <?php echo $page; ?>/<?php echo $totalPages; ?>&nbsp;</span>
    <?php if ($page < $totalPages): ?>
      <a href="?type=<?php echo $type; ?>&amp;page=<?php echo $page + 1; ?>&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-right"></span></a>
      <a href="?type=<?php echo $type; ?>&amp;page=<?php echo $totalPages; ?>&amp;items=<?php echo $items; ?>" class="btn btn-default"><span class="arrow fa fa-angle-double-right"></span></a>
    <?php endif; ?>
  <?php endif; ?>
</div>
<?php include("footer.html"); ?>
