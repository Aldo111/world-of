<?php
/**
 * This code contains an API class that is instantiated and executes a route()
 * function in order to execute a function associated with the existing route.
 *
 * The following routes exist:
 *    GET /users                       Get a list of users
 *    GET /users/{id}                  Get user belonging to that id
 *    GET /worlds                      Get existing worlds
 *    GET /worlds/{id}/hubs            Get hubs of a world

 *    POST /login                      Validates credentials
 *    POST /register                   Registers a new account
 *    POST /worlds/create              Create a new world
 *    POST /worlds/{id}/hubs/create    Create a new hub
 *
 */

header("Content-Type: application/json");

require "vendor/autoload.php";
require_once "db.php";
require_once "auth.php";

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

}

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
      $result = $that->db->getUsers($_GET);
      $result = $that->createListResult($result);
      return $that->storeResult($result, $response);
    });

    // Get a user by ID
    $this->app->get("/users/{id}",
      function ($request, $response, $args) use ($that) {
        $user_id = $request->getAttribute("id");
        $r = $that->db->getUserById($user_id);

        $result =  $r === false ? $that->errorMsg("User not found.") : $r;

        return $that->storeResult($result, $response);
    });

    // Get a user by ID
    $this->app->get("/users/{id}/collaborations",
      function ($request, $response, $args) use ($that) {
        $user_id = $request->getAttribute("id");
        $r = $that->db->getUserCollaborations($user_id, $_GET);

        $result =  $r === false ? $that->errorMsg("User not found.") : $that->createListResult($r);

        return $that->storeResult($result, $response);
    });

    // Get worlds
    $this->app->get("/worlds",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $fields = $_GET;
        $r = $that->db->getWorlds($fields);

        $result =  $r === false ? $that->errorMsg("User not found.") :
          $that->createListResult($r);

        return $that->storeResult($result, $response);
    });

    // Get hubs of a world
    $this->app->get("/worlds/{id}/hubs",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $fields = $_GET;
        $worldId = $request->getAttribute("id");
        $r = $that->db->getHubs($worldId);


        $result =  $r === false ? $that->errorMsg("World not found.") :
          $that->createListResult($r);

        return $that->storeResult($result, $response);
    });

    // Get links of a world
    $this->app->get("/worlds/{id}/links",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $fields = $_GET;
        $worldId = $request->getAttribute("id");
        $r = $that->db->getLinkSections($worldId);


        $result =  $r === false ? $that->errorMsg("World not found.") :
          $that->createListResult($r);

        return $that->storeResult($result, $response);
    });


    // Get sections of a hub
    $this->app->get("/worlds/{id}/hubs/{hubId}/sections",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $fields = $_GET;
        $hubId = $request->getAttribute("hubId");
        $r = $that->db->getSections($hubId);

        $result =  $r === false ? $that->errorMsg("Hub not found.") :
          $that->createListResult($r);

        return $that->storeResult($result, $response);
    });

    // Get reviews of a world
    $this->app->get("/worlds/{id}/reviews",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $fields = $_GET;
        $worldId = $request->getAttribute("id");
        $r = $that->db->getReviews($worldId);


        $result =  $r === false ? $that->errorMsg("World not found.") :
          $that->createListResult($r);

        return $that->storeResult($result, $response);
    });

    // Get metrics of a world
    $this->app->get("/worlds/{id}/metrics",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $fields = $_GET;
        $worldId = $request->getAttribute("id");
        $r = $that->db->getMetrics($worldId);


        $result =  $r === false ? $that->errorMsg("World not found.") :
          $that->createListResult($r);

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
            $that->auth->decodeClientPassword($details["password"]));

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
          $password = $that->auth->encryptPassword(
            $that->auth->decodeClientPassword($details["password"]));

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

    // Create world
    $this->app->post("/worlds/create",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $result = $that->errorMsg("Invalid details.");

        if (!isset($details["user_id"]) || !isset($details["name"]) || !isset($details["description"])) {
          $result = $that->errorMsg("Missing input");
        } else {
          $name = $details["name"];
          $description = $details["description"];
          $userId = $details["user_id"];


          $data = $that->db->createWorld($userId, $name, $description, $details);

          if ($data === false) {
            $result = $that->errorMsg("Error: Something bad happened!");
          } else {
            $result = $data;
          }

        }
        return $that->storeResult($result, $response);
    });

    // Create a hub
    $this->app->post("/worlds/{id}/hubs/create",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $result = $that->errorMsg("Invalid details.");

        $worldId = $request->getAttribute("id");

        if (!isset($details["user_id"]) || !isset($details["name"])) {
          $result = $that->errorMsg("Missing input");
        } else {
          $userId = $details["user_id"];
          $name = $details["name"];

          $data = $that->db->createHub($userId, $worldId, $name);

          if ($data === false) {
            $result = $that->errorMsg("Error: Something bad happened!");
          } else {
            $result = $data;
          }

        }
        return $that->storeResult($result, $response);
    });

    // Save a section
    $this->app->post("/worlds/{id}/hubs/{hub_id}/sections/save",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $result = $that->errorMsg("Invalid details.");

        $worldId = $request->getAttribute("id");
        $hubId = $request->getAttribute("hub_id");

        //TODO: should probably make an array where we can just add
        // these fields (user_id, text) and loop through and check automatically
        if (!isset($details["user_id"]) || !isset($details["sections"])) {
          $result = $that->errorMsg("Missing input");
        } else {
          $userId = $details["user_id"];
          $sections = $details["sections"];

          $data = $that->db->saveSections($userId, $hubId, $sections);

          if ($data === false) {
            $result = $that->errorMsg("Error: Something bad happened!");
          } else {
            $result = $that->successMsg($data);
          }

        }
        return $that->storeResult($result, $response);
    });

    // Update a world
    $this->app->put("/worlds/{id}",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $id = $request->getAttribute("id");
        $result = $that->errorMsg("Invalid details.");

        if ($details === null) {
          $result = $that->errorMsg("Nothing to be updated.");
        } else {
          $data = $that->db->updateWorld($id, $details);
          if ($data === false) {
            $result =
              $that->errorMsg("Error: The query seemed to have failed!");
          } else {
            $result = $that->successMsg();
          }
        }

        return $that->storeResult($result, $response);
    });

    // Delete a world
    $this->app->delete("/worlds/{id}",
      function($request, $response, $args) use ($that) {
        $id = $request->getAttribute("id");
        $result = $that->errorMsg("Invalid details.");

        $data = $that->db->deleteWorld($id);
        if ($data === false) {
          $result =
            $that->errorMsg("Error: The query seemed to have failed!");
        } else {
          $result = $that->successMsg();
        }


        return $that->storeResult($result, $response);
    });

    // Delete a hub
    $this->app->delete("/worlds/{id}/hubs/{hubId}",
      function($request, $response, $args) use ($that) {
        $hubId = $request->getAttribute("hubId");
        $result = $that->errorMsg("Invalid details.");

        $data = $that->db->deleteHub($hubId);
        if ($data === false) {
          $result =
            $that->errorMsg("Error: The query seemed to have failed!");
        } else {
          $result = $that->successMsg();
        }


        return $that->storeResult($result, $response);
    });

    // Create a review
    $this->app->post("/worlds/{id}/reviews/create",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $result = $that->errorMsg("Invalid details.");

        $worldId = $request->getAttribute("id");

        if (!isset($details["user_id"]) || !isset($details["rating"]) || !isset($details["text"])) {
          $result = $that->errorMsg("Missing input");
        } else {
          $userId = $details["user_id"];
          $rating = $details["rating"];
          $text = $details["text"];

          $data = $that->db->createReview($worldId, $userId, $rating, $text);

          if ($data === false) {
            $result = $that->errorMsg("Error: Something bad happened!");
          } else {
            $result = $data;
          }

        }
        return $that->storeResult($result, $response);
    });

    // Update a review
    $this->app->put("/worlds/{id}/reviews/{reviewId}",
      function($request, $response, $args) use ($that) {
        $details = $request->getParsedBody();
        $result = $that->errorMsg("Invalid details.");

        $worldId = $request->getAttribute("id");
        $reviewId = $request->getAttribute("reviewId");

        if (!isset($details["user_id"]) || !isset($details["rating"]) || !isset($details["text"])) {
          $result = $that->errorMsg("Missing input");
        } else {
          $userId = $details["user_id"];
          $rating = $details["rating"];
          $text = $details["text"];

          $data = $that->db->updateReview($reviewId, $rating, $text);

          if ($data === false) {
            $result = $that->errorMsg("Error: Something bad happened!");
          } else {
            $result = $that->successMsg();
          }

        }
        return $that->storeResult($result, $response);
    });

    // Add new collaborator
    $this->app->post("/worlds/{id}/collaborators",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $details = $request->getParsedBody();
        $fields = $_GET;
        $worldId = $request->getAttribute("id");
        $collabId = $details["collaborator_id"];
        $r = false;

        if (isset($collabId)) {
          $r = $that->db->addCollaborator($worldId, $collabId);
        }

        $result =  $r === false ? $that->errorMsg("Failed to add new collaborator.") :
          $that->successMsg();

        return $that->storeResult($result, $response);
    });

    // Remove collaborator
    $this->app->delete("/worlds/{id}/collaborators/{collab_id}",
      function ($request, $response, $args) use ($that) {
        // Query string parameters
        $fields = $_GET;
        $worldId = $request->getAttribute("id");
        $collabId = $request->getAttribute("collab_id");
        $r = false;

        if (isset($collabId)) {
          $r = $that->db->removeCollaborator($worldId, $collabId);
        }

        $result =  $r === false ? $that->errorMsg("Failed to remove new collaborator.") :
          $that->successMsg();

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

  /**
   * Creates an associative result object for list results containing count.
   *
   * @param array $result The result that needs to be counted and returned.
   *
   * @return array $result Result object.
   */
  private function createListResult($result) {
    $result = ["count" => count($result), "result" => $result];
    return $result;
  }

}

// Create API
$api = new API();
$api->route();

?>