<?php

namespace Zeega\IngestionBundle\Parser\Harvard;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;
use Berkman\CatalogBundle\Service\ViaPortfolio;

use \DateTime;

class ParserViaSet extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        $upload_dir = str_replace('src/Zeega/IngestionBundle/Parser/Harvard', 'web/', __DIR__);
        $filepath = str_replace('http://via.lib.harvard.edu/', $upload_dir, $url);
        $file = new \SplFileObject($filepath);

        $via = new ViaPortfolio();
        $items = array();
        $results = $via->getImagesFromImport($file);

        foreach ($results as $image) {
          $item = $this->buildItem($image);
          array_push($items, $item);
        }

        return $this->returnResponse($items, true, true, "", false);
      }

    private function buildItem($image) {
        $metadata = array('Title' => '', 'Creator' => '', 'Date' => '', 'Notes' => '');
        $metadata = array_merge($metadata, $image->getMetadata());
        $image_output = array(
            $metadata['Title'],
            $metadata['Notes'],
            $image->getUrl(),
            $image->getRecordUrl(),
            $image->getThumbnailUrl(),
            $metadata['Date'],
            $metadata['Creator']
        );
        $item = new Item();

        $item->setMediaCreatorRealname($metadata['Creator']);
        $item->setMediaType("Image");
        $item->setLayerType("Image");
        $item->setArchive("Harvard");
        $item->setUri($image->getUrl());
        $item->setAttributionUri($image->getRecordUrl());
        $item->setThumbnailUrl($image->getThumbnailUrl());
        $item->setTitle($metadata['Title']);
        $item->setDescription($metadata['Notes']);
        if (key_exists('Abstract', $metadata)) {
            $item->setDescription($metadata['Abstract'] . ' || ' . $item->getDescription());
        }
        $item->setAttributes(array("id" => $image->getId1().'|'.$image->getId2(), "width" => 2400, "height" => 2400));
        return $item;
    }
}
