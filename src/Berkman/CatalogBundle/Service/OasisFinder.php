<?php
namespace Berkman\CatalogBundle\Service;

use Berkman\CatalogBundle\Catalog\Instances\OASIS;
use Berkman\CatalogBundle\Entity\Image;
use Berkman\CatalogBundle\Entity\ImageGroup;

class OasisFinder {
  private $desired_results_per_page;

  public function __construct() {
    $this->catalog = new OASIS();
  }

  public function search($keyword = null, $desired_results = 25, $start_index = 0) {
    if (empty($keyword)) {
        $keyword = 'Harvard';
    }

    $result_count = 0;
    $results = $this->catalog->fetchResultsFlat($keyword, $desired_results, $start_index);

    return $results;
  }
}
