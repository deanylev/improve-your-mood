<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Admin Panel - <?php echo ucwords($title); ?>s</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/main.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <?php if ($title == "colour") { ?>
<script src="../assets/main.js"></script>
  <?php } ?>
</head>
<body>
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="../" class="navbar-brand">Admin Panel</a>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li><a href="../../">Home</a></li>
          <li class="<?php if ($title == "quote" && isset($version) && $version == "improve") { echo "active"; } ?>"><a href="../improve_quotes">Improve Quotes</a></li>
          <li class="<?php if ($title == "quote" && isset($version) && $version == "decrease") { echo "active"; } ?>"><a href="../decrease_quotes">Decrease Quotes</a></li>
          <li class="<?php if ($title == "colour") { echo "active"; } ?>"><a href="../colours">Colours</a></li>
          <li class="<?php if ($title == "setting") { echo "active"; } ?>"><a href="../settings">Settings</a></li>
          <li><a href="../preview">Preview</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <main class="container">
    <?php if (isset($_SESSION["alert"])) { ?>
      <br>
      <div class="alert alert-success">
        <?php echo $_SESSION["alert"]; ?>
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
      </div>
    <?php
      session_destroy();
    } ?>
    <h1>New <?php echo ucwords($title); ?></h1>
    <form action="new.php" method="POST">
      <input type="text" name="content" placeholder="Enter a <?php echo $title; ?>" id="new-input">

      <?php if ($title == "colour") { ?>

        <div class="colour-preview" id="colour-preview"></div>

      <?php } ?>

      <?php if ($title == "setting") { ?>

        <input type="text" name="value" placeholder="Enter a value">

      <?php } ?>

      <input type="submit" value="Save" class="btn btn-primary">
    </form>
    <br>
    <h1><?php echo ucwords($title); ?>s</h1>
    <table>
      <thead>
      <tbody>

        <?php

          $count = 0;

          if ($result->num_rows > 0) {
              while ($row = $result->fetch_assoc()) {
                $count += 1; ?>

                  <tr>
                    <td>
                      <form action="edit.php" method="POST">
                        <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
                        <input type="text" name="content" value="<?php echo $row[$title]; ?>">

                        <?php if ($title == "colour") { ?>

                          <div class="colour-preview" style="background-color: #<?php echo $row["colour"]; ?>"></div>

                        <?php } ?>

                        <?php if ($title == "setting") { ?>

                          <input type="text" name="value" value="<?php echo $row["value"]; ?>">

                        <?php } ?>

                        <input type="submit" value="Edit" class="btn btn-primary action-button">
                      </form>
                    </td>
                    <td>
                      <form action="active.php" method="POST">
                        <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
                        <input type="hidden" name="action" value="<?php echo !$row["active"]; ?>">
                        <input type="submit" value="<?php echo $row["active"] ? "Inactive" : "Active"; ?>" class="btn btn-primary action-button">
                      </form>
                    </td>
                    <td>
                      <form action="delete.php" method="POST">
                        <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
                        <input type="submit" value="Delete" class="btn btn-primary action-button">
                      </form>
                    </td>
                  </tr>

                  <?php
              }
          }

         ?>

       </tbody>
     </table>
     <br>
     <span><?php echo $count; ?> total</span>
   </main>
</body>

</html>
