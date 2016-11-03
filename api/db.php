<?php
require_once("config.php");

/**
 * Database access class.
 */
class DB {

  /** @var resource|null Stores database connection resource. */
  private $db = NULL;

  /**
   * Constructor.
   *
   * @return void
   */
  public function __construct() {
    //Database Details
    $host = DB_HOST;
    $user= DB_USER;
    $pass = DB_PASS;
    $db_name = DB;

    // Establish new db connection.
    $this->db = new mysqli($host, $user, $pass, $db_name);

    // Handle db connection error.
    if ($this->db->connect_error) {
      trigger_error("Database Connection Failed: ", $conn->connect_error,
        E_USER_ERROR);
    }
  }

  /**
   * Fetches account data by username.
   *
   * @param string $user_name The user name.
   *
   * @return array|false Returns an associative array with account data
   *    if user exists, else returns false.
   */
  public function getUserByName($user_name) {
    $user_name = $this->db->escape_string($user_name);
    $q=$this->db->query("SELECT * FROM accounts
      WHERE username = '$user_name'");
    if ($this->db->affected_rows == 1) {
      return $q->fetch_assoc();
    } else {
      return false; //error
    }
  }

  /**
   * Fetches account data by user id.
   *
   * @param int $user_id The user id.
   *
   * @return array|false Returns an associative array with account data
   *    if user exists, else returns false.
   */
  public function getUserById($user_id) {
    $q=$this->db->query("SELECT id, username FROM accounts
      WHERE id = $user_id");
    if ($this->db->affected_rows == 1) {
      return $q->fetch_assoc();
    } else {
      return false; //error
    }
  }

  /**
   * Creates a new user account.
   *
   * @param string $username The username.
   * @param string $password The password.
   *
   * @return array|false Returns an associative array with account data
   *    if user is created successfully, else returns false.
   */
  public function createAccount($username, $password) {
    $username = $this->sanitize($username);
    $password = $this->sanitize($password);

    $q=$this->db->query("INSERT into accounts (username, password)
      VALUES ('$username', '$password')");

    if ($q !== false) {
      $userQ = $this->db->query("SELECT id, username FROM accounts
        WHERE username='$username'");
      return $this->fetchAll($userQ)[0];
    } else {
      return false; //error
    }
  }

  /**
   * Creates a new world.
   *
   * @param string $userId The user creating the world.
   * @param string $name The world name.
   * @param string $description The description of the world.
   *
   * @return array|false Returns an associative array with world data
   *    if world is created successfully, else returns false.
   */
  public function createWorld($userId, $name, $description) {
    $userId = $this->sanitize($userId);
    $name = $this->sanitize($name);
    $description = $this->sanitize($description);

    $q=$this->db->query("INSERT into worlds (user_id, name, description)
      VALUES ('$userId', '$name', '$description')");

    if ($q !== false) {
      $insertId = $this->db->insert_id;
      $userQ = $this->db->query("SELECT * FROM worlds
        WHERE id='$insertId'");
      return $this->fetchAll($userQ)[0];
    } else {
      return false; //error
    }
  }

  /**
   * Creates a new hub.
   *
   * @param string $userId The user creating the hub.
   * @param string $worldId The world id.
   * @param string $name The name of the hub.
   *
   * @return array|false Returns an associative array with hub data
   *    if world is created successfully, else returns false.
   */
  public function createHub($userId, $worldId, $name) {
    $userId = $this->sanitize($userId);
    $worldId = $this->sanitize($worldId);
    $name = $this->sanitize($name);

    $q=$this->db->query("INSERT into hubs (user_id, world_id, name)
      VALUES ('$userId', '$worldId', '$name')");

    if ($q !== false) {
      $insertId = $this->db->insert_id;
      $userQ = $this->db->query("SELECT * FROM hubs
        WHERE id='$insertId'");
      return $this->fetchAll($userQ)[0];
    } else {
      return [$this->db->error]; //error
    }
  }

  /**
   * Creates a new section in a hub
   *
   * @param string $userId The user creating the world.
   * @param string $hubId The world name.
   * @param string $text The text content for this section.
   *
   * @return array|false Returns an associative array with world data
   *    if world is created successfully, else returns false.
   */
  public function createSection($userId, $hubId, $text) {
    $userId = $this->sanitize($userId);
    $hubId = $this->sanitize($hubId);
    $text = $this->sanitize($text);

    $q=$this->db->query("INSERT into hubs_content (user_id, hub_id, text)
      VALUES ('$userId', '$hubId', '$text')");

    if ($q !== false) {
      $insertId = $this->db->insert_id;
      $userQ = $this->db->query("SELECT * FROM hubs_content
        WHERE id='$insertId'");
      return $this->fetchAll($userQ)[0];
    } else {
      return [$this->db->error]; //error
    }
  }

  /**
   * Saves multiple sections in a hub
   *
   * @param string $userId The user creating the world.
   * @param string $hubId The world name.
   * @param array $sections Array containing sections data.
   *
   * @return boolean Returns true/false based on success/failure.
   */
  public function saveSections($userId, $hubId, $sections) {
    $userId = $this->sanitize($userId);
    $hubId = $this->sanitize($hubId);

    $sql = [];

    $index = 0;
    foreach ($sections as $section) {
      $index++;
      $text = $this->sanitize($section["text"]);
      $sql[] = "('".$userId."', '".$hubId."', '".$text."', '$index')";
    }

    // TODO - Don't do this lol after presentation, make a better
    // way using the frontend to only send sections that have been changed
    // instead of all, so as to avoid deleting/reinserting a LOT of stuff

    $deleteQ = $this->db->query("DELETE FROM hubs_content
      WHERE hub_id='$hubId'");
    $q=$this->db->query("INSERT into hubs_content (user_id, hub_id, `text`,
      ordering) VALUES ".implode(",", $sql));

    if ($q !== false) {
      return true;
    } else {
      return [$this->db->error]; //error
    }
  }

  /**
   * Fetches account data for all users.
   *
   * @return array|false Returns an associative array with account data
   *    if user exists, else returns false.
   */
  public function getUsers() {
    $q=$this->db->query("SELECT id, username FROM accounts");
    return $this->fetchAll($q);
  }



  /**
   * Fetches worlds data.
   *
   * @return array|false Returns an associative array with world data or false
   * if failed.
   */
  public function getWorlds($fields) {
    $extraConditions = $this->genExtra($fields);
    $q=$this->db->query("SELECT * FROM worlds". $extraConditions."
      ORDER BY id DESC");
    return $this->fetchAll($q);
  }


  /**
   * Fetches hub data of a world.
   *
   * @return array|false Returns an associative array with hub data or false
   * if failed.
   */
  public function getHubs($worldId) {
    //Check if world exists

    $q=$this->db->query("SELECT *
      FROM hubs WHERE world_id='$worldId' ORDER BY id ASC");
    if ($q !== false) {
      return $this->fetchAll($q);
    } else {
      return false; //error
    }
  }

  /**
   * Fetches section data of a hub.
   *
   * @return array|false Returns an associative array with section data or false
   * if failed.
   */
  public function getSections($hubId) {
    $q=$this->db->query("SELECT *
      FROM hubs_content WHERE hub_id='$hubId' ORDER BY id ASC");
    if ($q !== false) {
      return $this->fetchAll($q);
    } else {
      return false; //error
    }
  }


  /**
   * Convenience function that returns an array of data based on a query.
   *
   * @param resource $q A mysqli_result object.
   * @param MYSQLI_ASSOC|MYSQLI_NUM|MYSQLI_BOTH (optional) Optional type of
   *    return data.
   *
   * @return array|false $result Returns an associative array with account data
   *    if user exists, else returns false.
   */
  private function fetchAll($q, $type = MYSQLI_ASSOC) {
    for ($result = array(); $tmp = $q->fetch_array(MYSQLI_ASSOC);) {
      $result[] = $tmp;
    }
    return $result;
  }

  /**
   * Convenience function that converts an array of equality conditions into
   * a 'WHERE ..' string that can be appended at the end of an SQL query.
   *
   * @param array $fields Associative array containing key/value pairs for SQL.
   *
   * @return string The extra conditions in string form.
   */
  private function genExtra($fields) {
    $extra_conditions = "";

    // Handling extra conditions that can be appended to a db query.
    if (count($fields) > 0) {
      $extra_conditions = " WHERE";
      foreach ($fields as $field => $val) {
        if ($extra_conditions != " WHERE") {
          $extra_conditions.=" AND ";
        }
        $extra_conditions .= " {$field} = '{$val}' ";
      }
    }
    return $extra_conditions;
  }

  /**
   * Convenience function that returns an array of data based on a query. This
   * can be modified for better coverage in the future.
   *
   * @param mixed $variable Variable that needs to be sanitized.
   *
   * @return mixed Sanitized version of variable.
   */
  private function sanitize($variable) {
    if (gettype($variable) === "string") {
      $variable = $this->db->escape_string($variable);
    }

    return $variable;
  }
}
?>