<?php
define('IMAGE_DIR', 'static_images');
define('IMAGE_HOST', 'http://spectacle.example.com');

function newDimensions($orig_width, $orig_height, $size) {
  $vertical_offset = 0;
  $horizontal_offset = 0;
  $dimensions = array(
    4 => array(150, 150),
    5 => array(200, null),
    6 => array(250, 250)
  );

  $dest_width = $dimensions[$size][0];
  $dest_height = $dimensions[$size][1];

  if($dest_height == null)
  {
    // width is locked
    $dest_height = $dest_width * $orig_height / $orig_width;
  }

  $dest_ratio = $dest_width / $dest_height;
  $src_ratio = $orig_width / $orig_height;
  if ($dest_ratio > $src_ratio) {
    // dest is wider, so dest width is limiting
    $resize_by = $orig_width / $dest_width;
    $src_width = $orig_width;
    $src_height = $dest_height * $resize_by;
    $offset_x = 0;
    $offset_y = round(($orig_height - $src_height) / 2);
    
  } else {
    // dest is taller, so dest height is limiting
    $resize_by = $orig_height / $dest_height;
    $src_width = $dest_width * $resize_by;
    $src_height = $orig_height;
    $offset_x = round(($orig_width - $src_width) / 2);
    $offset_y = 0;
  }

  $output = array(
    $offset_x,
    $offset_y,
    $dest_width,
    $dest_height,
    $src_width,
    $src_height
  );
  return $output;
}

function imageCreateFromAny($filepath) { 
  $type = exif_imagetype($filepath); // [] if you don't have exif you could use getImageSize() 
  $allowedTypes = array( 
    1,  // [] gif 
    2,  // [] jpg 
    3,  // [] png 
    6   // [] bmp 
  ); 
  if (!in_array($type, $allowedTypes)) { 
    return false; 
  } 
  switch ($type) { 
  case 1 : 
    $im = imageCreateFromGif($filepath); 
    break; 
  case 2 : 
    $im = imageCreateFromJpeg($filepath); 
    break; 
  case 3 : 
    $im = imageCreateFromPng($filepath); 
    break; 
  case 6 : 
    $im = imageCreateFromBmp($filepath); 
    break; 
  }    
  return $im;  
} 

function generateFilename($url, $size) {
  return md5($url) . '_' . $size . '.jpg';
}

function getUrl($url, $size) {
  $base_url = IMAGE_HOST . '/' . IMAGE_DIR . '/';
  return $base_url . generateFilename($url, $size);
}

function getFilepath($url, $size) {
  $image_dir = getcwd() . '/' . IMAGE_DIR . '/';
  return $image_dir . generateFilename($url, $size);
}

// Resample

if (isset($_GET['url'])) {
  $url = $_GET['url'];
} else {
  if (empty($_FILES)) {
    die('I need a URL or a file'); 
  }

  $url = $_FILES['file']['tmp_name'];
}


$image_urls = array();

if (isset($_GET['sizes'])) {
  $sizes = array_map('intval', str_split($_GET['sizes']));
} else { 
  $sizes = array(4,5,6,7);
}
if (!in_array(7, $sizes)) { $sizes[] = 7; }

$have_sizes = array();
foreach($sizes as $size) {
  $image_filepath = getFilepath($url, $size);
  if (file_exists($image_filepath)) {
    $image_urls['image_url_' . $size] = getUrl($url, $size);
    $have_sizes[] = $size;
  }
}

$sizes_to_generate = array_diff($sizes, $have_sizes);

if (!empty($sizes_to_generate)) {
  $image = imageCreateFromAny($url);
  $original_width = imagesx($image);
  $original_height = imagesy($image);
}

foreach($sizes_to_generate as $size) {
  if ($size <= 3) {
    continue;
  }
  elseif ($size >= 7) {
    $dest_width = $original_width;
    $dest_height = $original_height;
    $src_width = $original_width;
    $src_height = $original_height;
    $offset_x = 0;
    $offset_y = 0;
  }
  else {
    list($offset_x, $offset_y, $dest_width, $dest_height, $src_width, $src_height) =
      newDimensions($original_width, $original_height, $size);
  }
  $image_p = imagecreatetruecolor($dest_width, $dest_height);
  imagecopyresampled(
    $image_p,
    $image,
    0,
    0,
    $offset_x,
    $offset_y,
    $dest_width,
    $dest_height,
    $src_width,
    $src_height
  );
  imagejpeg($image_p, getFilepath($url, $size));
  $image_urls['image_url_' . $size] = getUrl($url, $size);
  if ($size >= 7) {
    $image_urls['fullsize_url'] = getUrl($url, $size);
  }
}

echo json_encode($image_urls);
