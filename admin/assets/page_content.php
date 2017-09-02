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
  <?php if ($title == "colour"): ?>
<script src="../assets/main.js"></script>
  <?php endif; ?>
</head>
<body>
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="../" class="navbar-brand">Admin Panel</a>
      </div>
      <div class="collapse navbar-collapse" id="nav">
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
    <?php if (isset($_SESSION["alert"])): ?>
      <br>
      <div class="alert alert-success">
        <?php echo $_SESSION["alert"]; ?>
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
      </div>
    <?php
      session_destroy();
    endif; ?>
    <h1>New <?php echo ucwords($title); ?></h1>
    <form action="new.php" method="POST">
      <input type="text" name="content" placeholder="Enter a <?php echo $title; ?>" id="new-input">

      <?php if ($title == "colour"): ?>

        <div class="colour-preview" id="colour-preview"></div>

      <?php endif; ?>

      <?php if ($title == "setting"): ?>

        <input type="text" name="value" placeholder="Enter a value">
        <select name="user">
          <option selected disabled>User Setting</option>
          <option value="0">False</option>
          <option value="1">True</option>
        </select>
        <select name="advanced">
          <option selected disabled>Advanced</option>
          <option value="0">False</option>
          <option value="1">True</option>
        </select>
        <select name="mobile">
          <option selected disabled>Mobile</option>
          <option value="0">False</option>
          <option value="1">True</option>
        </select>
        <select name="input">
          <option selected disabled>Input Type</option>
          <option value="number">Number</option>
          <option value="text">Text</option>
          <option value="select">Select</option>
        </select>
        <br>
        <input type="text" name="label" placeholder="Enter a label">
        <br>
        <textarea name="description" rows="4" cols="82" placeholder="Enter a description"></textarea>
        <br>

      <?php endif; ?>

      <input type="submit" value="Save" class="btn btn-primary">
    </form>
    <br>
    <h1><?php echo ucwords($title); ?>s</h1>
    <table>
      <tbody>

        <?php

          $count = 0;

          if ($result->num_rows > 0):
              while ($row = $result->fetch_assoc()):
                $count += 1; ?>

                  <tr>
                    <?php if ($title != "setting"): ?>
                      <td><span><?php echo $count; ?>.</span></td>
                    <?php endif; ?>
                    <td>
                      <form action="edit.php" method="POST">
                        <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
                        <input type="text" name="content" value="<?php echo $row[$title]; ?>">

                        <?php if ($title == "colour"): ?>

                          <div class="colour-preview" style="background-color: #<?php echo $row["colour"]; ?>"></div>

                        <?php endif; ?>

                        <?php if ($title == "setting"): ?>

                          <input type="text" name="value" value="<?php echo $row["value"]; ?>">
                          <select name="user">
                            <option disabled>User Setting</option>
                            <option value="0" <?php echo $row["user"] ? "" : "selected"; ?>>False</option>
                            <option value="1" <?php echo $row["user"] ? "selected" : ""; ?>>True</option>
                          </select>
                          <select name="advanced">
                            <option disabled>Advanced</option>
                            <option value="0" <?php echo $row["advanced"] ? "" : "selected"; ?>>False</option>
                            <option value="1" <?php echo $row["advanced"] ? "selected" : ""; ?>>True</option>
                          </select>
                          <select name="mobile">
                            <option disabled>Mobile</option>
                            <option value="0" <?php echo $row["mobile"] ? "" : "selected"; ?>>False</option>
                            <option value="1" <?php echo $row["mobile"] ? "selected" : ""; ?>>True</option>
                          </select>
                          <select name="input">
                            <option disabled>>Input Type</option>
                            <option value="number" <?php echo $row["input"] == "number" ? "selected" : ""; ?>>Number</option>
                            <option value="text" <?php echo $row["input"] == "text" ? "selected" : ""; ?>>Text</option>
                            <option value="select" <?php echo $row["input"] == "select" ? "selected" : ""; ?>>Select</option>
                          </select>

                        <?php endif; ?>

                        <input type="submit" name="edit_item" value="Edit" class="btn btn-primary action-button">
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

                  <?php if ($title == "setting" && $row["user"]): ?>

                    <tr>
                      <td>
                        <form action="edit.php" method="POST">
                          <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
                          <input type="text" name="label" value="<?php echo $row["label"]; ?>">
                          <br>
                          <textarea name="description" rows="4" cols="82"><?php echo $row["description"]; ?></textarea>
                          <br>
                          <input type="submit" name="edit_description" value="Edit" class="btn btn-primary action-button">
                          <br><br>
                        </form>
                      </td>
                    </tr>

                  <?php endif ?>

                  <?php
              endwhile;
          endif;

         ?>

       </tbody>
     </table>
     <br>
     <span><?php echo $count; ?> total</span>
   </main>
   <footer class="footer">
     <div class="container">
       <p class="text-muted">MoodBackend v1.1 | &copy; 2017 <a href="https://deanlevinson.com.au">Dean Levinson</a></p>
     </div>
   </footer>
</body>

</html>
