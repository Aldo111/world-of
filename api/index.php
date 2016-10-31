<?php
/**
 * This code contains an API class that is instantiated and executes a route()
 * function in order to execute a function associated with the existing route.
 *
 * The following routes exist:
 *    GET /users                 Get a list of users
 *    GET /users/{id}            Get user belonging to that id
 *    POST /login                Validates credentials
 *    POST /register             Registers a new account
 */

header("Content-Type: application/json");

require "vendor/autoload.php";
require_once "db.php";
require_once "auth.php";

/**
 * Class exposing routes for our REST API using the Slim framework.
 */
class API {

  /**
   * @var \Slim\App $app Slim app instance.
   * @var DB $db DB instance.
   * @var Auth Auth instance.
   */
  private $app = NULL, $db = NULL, $auth = NULL;

  /**
   * Constructor initializing the instances for the class properties.
   *
   * @return void
   */
  public function __construct() {
    $this->app = new \Slim\App;
    $this->db = new DB();
    $this->auth = new Auth();
  }

  /**
   * Defines and runs the Slim app routes.
   *
   * @return void
   */
  public function route() {
    // Temporary lexical scope for the closures
    $that = $this;

    // Get a list of all users
    $this->app->get("/users", function($request, $response, $args) use ($that) {
      $result = $that->db->getUsers();
      $result = ["count" => count($result), "result" => $result];
      return $that->storeResult($result, $response);
    });

    // Get a user by ID
    $this->app->get("/users/{id}",
      function ($request, $response, $args) use ($that) {
        $user_id = $request->getAttribute("id");
        $r = $that->$db->getUserById($user_id);

        $result =  $r === false ? $that->errorMsg("User not found.") : $r;

        return $that->storeResult($result, $response);
    });

    // Login authorization endpoint
    $this->app->post("/login",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $result = $that->errorMsg("Invalid Authentication Details");

        if (!isset($details["username"]) || !isset($details["password"])) {
          $result = $that->errorMsg("Missing input.");
          return $that->storeResult($result, $response);
        } else {
          $r = $that->auth->verifyUser($details["username"],
            $details["password"]);

          // Incorrect details
          if ($r === false) {
            return $that->storeResult(
              $that->errorMsg("Incorrect authentication details."), $response);
          } else {
            $result = $r;
          }
        }
        return $that->storeResult($result, $response);
    });

    // Registration endpoint
    $this->app->post("/register",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $result = $that->errorMsg("Invalid details.");

        if (!isset($details["username"]) || !isset($details["password"])) {
          $result = $that->errorMsg("Missing input.");
        } else {
          $username = $details["username"];
          $password = $that->auth->encryptPassword($details["password"]);

          // Check if the username already exists
          if ($that->doesUserExist($username)) {
            $result = $that->errorMsg("'{$username}' is already taken.");
          } else {
            // TODO: Add a password-rule enforcing regex check before this

            $data = $that->db->createAccount($username, $password);

            if ($data === false) {
              $result = $that->errorMsg("Error: Something bad happened!");
            } else {
              $result = $data;
            }
          }
        }
        return $that->storeResult($result, $response);
    });

    // Start the router
    $this->app->run();
  }

  /**
   * Returns a Slim response object modified with the passed result.
   *
   * @param array $result The result that needs to be encoded.
   * @param resource $response Slim response resource.
   *
   * @return resource $response Slim response resource.
   */
  private function storeResult($result, $response) {
    $response->write(json_encode($result, JSON_NUMERIC_CHECK));
    return $response;
  }

  /**
   * Returns an array encapsulating an error message.
   *
   * @param string $msg (optional) An error message to be outputted optionally.
   *
   * @return array A standard array storing an error message.
   */
  private function errorMsg($msg = "Error") {
    return ["error" => $msg];
  }

  /**
   * Returns an array encapsulating a success message.
   *
   * @param string|true $msg (optional) A success message to be
   *    outputted optionally.
   *
   * @return array A standard array storing a success message.
   */
  private function successMsg($msg = true) {
    return ["success" => $msg];
  }

  /**
   * Checks if a user exists by this username.
   *
   * @param string $username The username to check against.
   *
   * @return boolean Returns true/false if user exists/doesn"t exist.
   */
  private function doesUserExist($username) {
    return ($this->db->getUserByName($username)) !== false;
  }

}

// Create API
$api = new API();
$api->route();

?>