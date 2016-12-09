<?php
require_once("db.php");

/**
 * Authentication and authorization convenience class.
 */
class Auth {

  /**
   * Hashes a plaintext password using the blowfish algorithm.
   *
   * @param string $p A password.
   *
   * @return string $hash The encrypted password.
   */
  public function encryptPassword($p) {
    $options = [
      'cost' => 11
    ];

    // Blowfish crypt
    $hash = password_hash($p, PASSWORD_BCRYPT, $options);
    return $hash;
  }

  /**
   * Decodes a doubly-base64 encoded password sent from the client.
   *
   * @param string $encoded The doubly-encoded password.
   *
   * @return string $decoded The decoded password.
   */
  public function decodeClientPassword($p) {
    return base64_decode(base64_decode($p));
  }

  /**
   * Verifies user credentials (username and password).
   *
   * @param string $user_name A username.
   * @param string $user_pass A user password.
   *
   * @return array|false Returns an associative array with account data
   *    if user exists, else returns false.
   */
  public function verifyUser($username, $password) {
    $db = new DB();
    $return = false;
    $user = $db->getUserByName($username);
    if (!$user) {
      return false;
    } else {
      if (!$this->verifyPass($password, $user['password'])) {
        return false;
      } else {
        unset($user['password']);
        return $user;
      }
    }
  }

  /**
   * Verifies inputted password against the database-stored hash.
   *
   * @param string $user_pass A password.
   * @param string $db_pass The encrypted password stored in the database.
   *
   * @return boolean Returns true or false depending on if the password matches.
   */
  private function verifyPass($user_pass, $db_pass) {
    return password_verify($user_pass, $db_pass);
  }
}
?>