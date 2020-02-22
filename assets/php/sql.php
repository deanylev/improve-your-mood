<?php

  if (!function_exists("getEnvValue")) {
    function getEnvValue($key, $default) {
      return getenv($key) ? getenv($key) : $default;
    }
  }

  $host = getEnvValue("MYSQL_HOST", "localhost");
  $username = getEnvValue("MYSQL_USERNAME", "root");
  $password = getEnvValue("MYSQL_PASSWORD", "");
  $name = getEnvValue("MYSQL_NAME", "yourmood");
  $mysqli = new mysqli($host, $username, $password, $name);
