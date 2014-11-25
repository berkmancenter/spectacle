<?php
namespace Berkman\CatalogBundle\Service;

use Berkman\CatalogBundle\Catalog\Instances\VIA;
use Berkman\CatalogBundle\Catalog\Instances\OASIS;
use Berkman\CatalogBundle\Catalog\Instances\TED;
use Berkman\CatalogBundle\Catalog\Instances\PAGE;
use Berkman\CatalogBundle\Entity\Finder;

class CSVFinder {
  public function __construct() {
    $this->finder = new Finder();
    $this->finder->addCatalogs(new VIA());
    $this->finder->addCatalogs(new OASIS());
    $this->finder->addCatalogs(new TED());
    $this->finder->addCatalogs(new PAGE());
  }

  public function import($file) {
    $failed = array();
    $images = array();
    $file->setFlags(\SplFileObject::READ_CSV);
    foreach ($file as $row) {
      if (isset($row[1])) {
        $catalog = strtoupper($row[0]);
        $args = array_slice($row, 1);
        $catalog = $this->finder->getCatalog($catalog);
        $image = $catalog->importImage($args);
        if ($image) {
          $images[] = $image;
        }
        else {
          $failed[] = $row;
        }
      }
    }

    return $images;
  }
}
