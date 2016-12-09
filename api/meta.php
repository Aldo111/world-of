<?php
require('config.php');
require('db.php');
$db = new DB();
$path = $_SERVER['REQUEST_URI'];

// Generating specific metas for worlds/{id} pages
if (preg_match('/worlds\/([0-9]*)\//', $path, $matches)) {
  $worldId = $matches[1];
  $worlds = $db->getWorlds(['id' => $worldId]);

  if ($worlds && count($worlds) > 0) {
    $world = $worlds[0];
    $name = $world['name'];
    $description = $world['description'];
    $author = $world['username'];
  }


  generateMetas($name, $description, $author);
} else {
  generateMetas('World Of', 'Create rich and immersive worlds and share them with others!', 'Adarsh Sinha');
}

function generateMetas($title, $description, $author) {
  echo '<title>'.$title.'</title>';
  echo '<meta name="description" content="'.$description.'">';
  echo '<meta name="author" content="'.$author.'">';
  echo '<meta property="og:image" content="http://'.$_SERVER['HTTP_HOST'].'/img/logo-200.png" />';
}

if (BASE_HREF !== null) {
  define(BASE_HREF, '/');
}
echo '<base href="'.BASE_HREF.'">';
echo '<script>window.base="'.BASE_HREF.'";</script>';

?>

