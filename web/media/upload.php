<?php
require_once '../../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Response;

define("MAX_UPLOAD_SIZE", 3 * pow(10, 6));

$upload_types = array(
  'portfolio' => array(
    'mime_types' => array('application/xml', 'text/xml', 'text/plain'),
    'extension' => 'xml',
    'service_url_base' => 'http://via.lib.harvard.edu/'
  ),
  'manifest' => array(
    'mime_types' => array('text/csv', 'text/plain'),
    'extension' => 'csv',
    'service_url_base' => 'http://spectacle.local/'
  )
);

try {
  check_size($_FILES);
  $type = get_type($_FILES, $upload_types);
} catch (Exception $e) {
  $response = new Response('', $e->getMessage());
  $response->send();
  exit();
}

$upload_dir = '/upload/' . $type . '/';
$filename = basename($_FILES['file']['name']);
$uploadfile = getcwd() . $upload_dir . $filename;

if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
  $url = $upload_types[$type]['service_url_base'] . 'media' . $upload_dir . $filename;
  $payload = json_encode(array('url' => $url));
  $response = new Response($payload, 200);
  $response->send();
} else {
  $response = new Response('', 500);
  $response->send();
}

function get_type($files, $upload_types) {
  $type = mime_content_type($files['file']['tmp_name']);
  $path_parts = pathinfo($files['file']['name']);
  foreach ($upload_types as $type_name => $attr) {
    if (in_array($type, $attr['mime_types'])
        && $path_parts['extension'] == $attr['extension']) {
      return $type_name;
    }
  }
  throw new Exception(415);
}

function check_size($files) {

  if (!isset($files['file']) || $files['file']['size'] == 0) {
    throw new Exception(500);
  }

  if ($files['file']['size'] > MAX_UPLOAD_SIZE) {
    throw new Exception(413);
  }
}

?>
