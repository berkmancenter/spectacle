<?php

namespace Zeega\IngestionBundle\Parser\Harvard;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;
use Symfony\Component\HttpFoundation\Response;
use Berkman\CatalogBundle\Service\OasisFinder;

use \DateTime;

class ParserOasisTag extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        if ( isset($parameters) ) {
            if ( isset($parameters["regex_matches"][1]) ) {
                $keyword = $parameters["regex_matches"][1];
                if( $parameters["regex_matches"][2] ){
                    $offset = $parameters["regex_matches"][2];
                } else {
                    $offset = 0;
                }
                $oasis = new OasisFinder();
                $items = array();
                $results = $oasis->search($keyword, 50, $offset);
                foreach ($results['results'] as $image) {
                    $item = $this->buildItem($image);
                    array_push($items, $item);
                }
            }
        }
        return $this->returnResponse($items, true, true, "", $results['more']);
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
