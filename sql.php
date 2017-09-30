<?php

  class MySQL
  {
      public $host;
      public $username;
      public $password;
      public $query;

      public function connect()
      {
          return mysqli_connect($this->host, $this->username, $this->password);
      }

      public function disconnect()
      {
          return $this->connect()->close();
      }

      public function run_query()
      {
          if ($this->connect()->query($this->query) === false) {
              echo "Error: " . $this->query . "<br>" . $this->connect()->error;
          }
      }

      public function result()
      {
          return $this->connect()->query($this->query);
      }

      public function row()
      {
          return $this->result()->fetch_assoc();
      }
  }

  $settings = parse_ini_file("settings.ini", true);
  $mysql = new MySQL;
  $mysql->host = $settings["MYSQL"]["host"];
  $mysql->username = $settings["MYSQL"]["username"];
  $mysql->password = $settings["MYSQL"]["password"];
  $conn = $mysql->connect();
