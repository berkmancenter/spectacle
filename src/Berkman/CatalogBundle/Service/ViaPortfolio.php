<?php
namespace Berkman\CatalogBundle\Service;

use Berkman\CatalogBundle\Catalog\Instances\VIA;
use Berkman\CatalogBundle\Entity\Image;
use Berkman\CatalogBundle\Entity\ImageGroup;

class ViaPortfolio {
  private $desired_results_per_page;

  public function __construct() {
    $this->catalog = new VIA();
  }

  public function getImagesFromImport($file) {

    $results = $this->catalog->getImagesFromImport($file);

    return $results;
  }
}
