<?php

  if (getenv("ADMIN_SIGNUP") === "1" && getenv("ADMIN_KEY")) {
    echo "true";
  } else {
    echo "false";
  }
