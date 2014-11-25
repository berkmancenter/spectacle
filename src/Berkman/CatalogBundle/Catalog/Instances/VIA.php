<?php
namespace Berkman\CatalogBundle\Catalog\Instances;

use Berkman\CatalogBundle\Catalog\Interfaces;
use Berkman\CatalogBundle\Entity\Image;
use Berkman\CatalogBundle\Entity\ImageGroup;
use Berkman\CatalogBundle\Entity\Catalog;

class VIA extends Catalog implements Interfaces\ImageGroupSearchInterface, Interfaces\CustomImportInterface, Interfaces\ImageSearchInterface {

    /*
     * id_1 = recordId
     * id_2 = componentId
     * id_3 = metadataId
     * id_4 = metadataSubId
     * id_5 = imageId
     * id_6 = thumbnailId
     */
    private $name = 'Visual Information Access';
    private $id = 'VIA';

    const SEARCH_URL_PATTERN    = 'http://webservices.lib.harvard.edu/rest/hollis/search/dc/?curpage={page}&q=format:matPhoto+branches-id:NET+{keyword}';
    const RECORD_URL_PATTERN    = 'http://via.lib.harvard.edu/via/deliver/deepLinkItem?recordId={id-1}&componentId={id-2}';
    const METADATA_URL_PATTERN  = 'http://webservices.lib.harvard.edu/rest/mods/via/{id-3}';
    const IMAGE_URL_PATTERN     = 'http://nrs.harvard.edu/urn-3:{id-5}?width=2400&height=2400';
    const THUMBNAIL_URL_PATTERN = 'http://nrs.harvard.edu/urn-3:{id-6}';
    const QR_CODE_URL_PATTERN   = 'http://m.harvard.edu/libraries/detail?id=viaid%3A{id-1}';
    const NODES_PER_PAGE        = 25;


    private function getSearchUrl($keyword, $page) {
        return str_replace(
            array('{keyword}', '{page}'),
            array(urlencode($keyword), $page), 
            self::SEARCH_URL_PATTERN
        );
    }

    private function getNodeList($xpath) {
        return $xpath->document->getElementsByTagName('item');
    }

    private function getTotalResults($xpath) {
        return (int) $xpath->document->getElementsByTagName('totalResults')->item(0)->textContent;
    }


    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    private function getObjectFromNode($node)
    {
        $recordId = $node->getAttribute('hollisid');
        $metadataId = $recordId;
        $componentId = null;
        $metadataSubId = null;
        $imageId = null;
        $thumbnailId = null;

        $numberOfImages = $node->getElementsByTagName('numberofimages')->item(0);
        if (is_null($numberOfImages) || $numberOfImages->textContent < 1) {
            return null;
        }

        $thumbnail = $node->getElementsByTagName('thumbnail')->item(0);
        $fullImage = $node->getElementsByTagName('fullimage')->item(0);
        if (!($thumbnail && $fullImage)) {
            return null;
        }

        $thumbnailUrl = $thumbnail->textContent;
        $thumbnailId = substr($thumbnailUrl, strpos($thumbnailUrl, ':', 5) + 1);
        $fullImageUrl = $fullImage->textContent;
        $componentId = substr($fullImageUrl, strpos($fullImageUrl, ':', 5) + 1);
        $imageId = $componentId;
        $image = new Image(
            $this,
            $recordId,
            $componentId,
            $metadataId,
            $metadataSubId,
            $imageId,
            $thumbnailId
        );
        if ($numberOfImages->textContent == 1 && $this->isImagePublic($image)) {
            return $image;
        } 

        $imageGroup = new ImageGroup($this, $recordId);
        $imageGroup->addImages($image);
        if ($this->isImageGroupPublic($imageGroup)) {
            return $imageGroup;
        }
    }

    /**
     * Takes array of results (Images and ImageGroups) and returns just Images
     */
    private function flattenResults($results) {
        $images = array();

        foreach ($results as $result) {
            if ($result instanceof Image) {
                $images[] = $result;
            }
            elseif ($result instanceof ImageGroup) {
                $images = array_merge($images, $result->getAllImages()->toArray());
            }
        }

        return $images;
    }

    private function getPageFromStartIndex($start_index)
    {
        return floor($start_index / self::NODES_PER_PAGE) + 1;
    }

    private function getTotalPages($xpath)
    {
        $total_pages = $xpath->document->getElementsByTagName('totalpages');
        if ($total_pages->length > 0) {
            return (int) $total_pages->item(0)->textContent;
        }
        return 1;
    }

    /**
     * Not used now - keeping as it might be useful
     */
    private function getPageFromStartIndexFlat($keyword, $start_index)
    {
        $page = 1;
        if ($start_index == 0) {
            return array('page' => $page, 'new_start' => 0);
        }
        $result_count = 0;
        $search_url = $this->getSearchUrl($keyword, $page);
        $xpath = $this->fetchXpath($search_url);

        $total_pages = $this->getTotalPages($xpath);
        while ($page <= $total_pages) {
            $node_list = $this->getNodeList($xpath);
            $objects = $this->getObjectsFromNodeList($node_list);
            $images = $this->flattenResults($objects);
            if ($result_count + count($images) >= $start_index) {
                return array('page' => $page, 'new_start' => $result_count + count($images) - $start_index);
            }

            $result_count += count($images);
            $page += 1;
            $search_url = $this->getSearchUrl($keyword, $page);
            $xpath = $this->fetchXpath($search_url);
        }
        return array('page' => $page, 'new_start' => 0);
    }

    private function getObjectsFromNodeList($node_list, $start_index = 0, $count = null)
    {
        $ii = $node_list->length;
        if ($count > $ii) {
            throw new \ErrorException('Requested count higher than node list length');
        }

        $results = array();
        for ($i = $start_index; $i < $ii; $i++) {
            if (count($results) === $count) {
                return $results;
            }
            $node = $node_list->item($i);
            $object = $this->getObjectFromNode($node);
            if ($object) {
                $results[] = $object;
            }
        }

        return $results;
    }

    /**
     * Get search results
     *
     * @param string $keyword
     * @param int $startIndex
     * @param int $endIndex
     * @return array An array of the form array('images' => $images, 'totalResults' => $totalResults)
     */
    public function fetchResults($keyword, $startIndex, $count)
    {
        $results = array();
        $totalResults = 0;

        $page = $this->getPageFromStartIndex($startIndex);
        $search_url = $this->getSearchUrl($keyword, $page);

        $xpath = $this->fetchXpath($search_url);
        $totalResults = $this->getTotalResults($xpath);

        $start = $startIndex % self::NODES_PER_PAGE;
        $nodeList = $this->getNodeList($xpath);

        $results = $this->getObjectsFromNodeList($nodeList, $startIndex, $count);

        return array('results' => $results, 'totalResults' => $totalResults);
    }

    /**
     * Only returns images - flattens image groups
     */
    public function fetchResultsFlat($keyword, $desired_results = 25, $start_index = 0)
    {
        $results = array();

        $page = 1;

        $search_url = $this->getSearchUrl($keyword, $page);
        $xpath = $this->fetchXpath($search_url);

        $total_pages = $this->getTotalPages($xpath);

        $node_list = $this->getNodeList($xpath);
        $results = $this->getObjectsFromNodeList($node_list);
        $images = $this->flattenResults($results);

        while (count($images) - $start_index < $desired_results && $page < $total_pages) {
            $page += 1;
            $search_url = $this->getSearchUrl($keyword, $page);
            $xpath = $this->fetchXpath($search_url);
            $node_list = $this->getNodeList($xpath);
            $results = $this->getObjectsFromNodeList($node_list);
            $images = array_merge($images, $this->flattenResults($results));
        }

        $more = $this->areMoreLeft($images, $page, $total_pages, $desired_results, $start_index);
        $images = $this->cutResultsToSize($images, $desired_results, $start_index);

        return array('results' => $images, 'more' => $more);
    }

    private function areMoreLeft($images, $page, $total_pages, $desired_results, $start_index)
    {
        if ($page < $total_pages || count($images) > $start_index + $desired_results) {
            return true;
        } else {
            return false;
        }
    }

    private function cutResultsToSize($results, $desired_results, $start_index)
    {
        $image_count = count($results);

        // Start index out of range
        if ($image_count < $start_index) {
            return array();
        }

        // There aren't enough images, so return truncated set
        if ($start_index + $desired_results > $image_count) {
            return array_slice($results, $start_index);
        }

        return array_slice($results, $start_index, $desired_results);
    }

    /**
     * Get the metadata for a given image
     *
     * @param Berkman\SlideshowBundle\Entity\Image $image
     * @return array An associative array where the key is the metadata field name and value is the value
     */
    public function getImageMetadata(Image $image)
    {
        $metadata = array();
        $fields = array(
            'Title' => './/mods:title',
            'Creator' => './/mods:namePart[1]',
            'Date' => './/mods:dateCreated[last()]',
            //'Usage Restrictions' => './/mods:accessCondition',
            'Abstract' => './mods:abstract',
            'Notes' => './mods:note'
        );
        $metadataId = $image->getId3();
        if ($image->getId4()) {
            $metadataId = $image->getId4();
        }
        $metadataUrl = $this->fillUrl(self::METADATA_URL_PATTERN, $image);
        $xpath = $this->fetchXpath($metadataUrl);
        $xpath->registerNamespace('mods', 'http://www.loc.gov/mods/v3');
        $recordIdent = $xpath->query("//mods:recordIdentifier[.='".$metadataId."']")->item(0);
        if ($recordIdent) {
            $recordContainer = $recordIdent->parentNode->parentNode;
            
            foreach ($fields as $name => $query) {
                $nodes = $xpath->query($query, $recordContainer);
                foreach($nodes as $node) {
                    if (key_exists($name, $metadata)) {
                        $metadata[$name] = $metadata[$name] . '; ' . $node->textContent;
                    } else {
                        $metadata[$name] = $node->textContent;
                    }
                }
            }
        }

        return $metadata;
    }

    public function getImageAltText(Image $image)
    {
        $metadata = $this->getImageMetadata($image);
        return $metadata['Title'];
    }

    private function isImagePublic(Image $image)
    {
        $public = false;
        $xpath = $this->fetchXpath($this->fillUrl(self::METADATA_URL_PATTERN, $image));
        $xpath->registerNamespace('mods', 'http://www.loc.gov/mods/v3');
        $imageNodes = $xpath->query("//mods:url[@displayLabel='Full Image'][contains(.,'" . $image->getId5() . "')]");
        if ($imageNodes->item(0) && $imageNodes->item(0)->getAttribute('note') == 'unrestricted') {
            $public = true;
        }
        return $public;
    }

    private function isImageGroupPublic(ImageGroup $imageGroup)
    {
        $recordId = $imageGroup->getId1();
        $imageGroupUrl = str_replace('{id-3}', $recordId, self::METADATA_URL_PATTERN);
        $xpath = $this->fetchXpath($imageGroupUrl);
        $xpath->registerNamespace('mods', 'http://www.loc.gov/mods/v3');
        $publicImages = $xpath->query(".//mods:url[@displayLabel='Full Image'][@note='unrestricted']");
        return $publicImages->length > 0;
    }

    /**
     * Get the full image url for a given image object
     *
     * @param Berkman\SlideshowBundle\Entity\Image @image
     * @return string $imageUrl
     */
    public function getImageUrl(Image $image)
    {
        return $this->fillUrl(self::IMAGE_URL_PATTERN, $image);
    }

    /**
     * Get the thumbnail url for a given image object
     *
     * @param Berkman\SlideshowBundle\Entity\Image @image
     * @return string $thumbnailUrl
     */
    public function getImageThumbnailUrl(Image $image)
    {
        return $this->fillUrl(self::THUMBNAIL_URL_PATTERN, $image);
    }

    /**
     * Get the authoritative record url for a given image object
     *
     * @param Berkman\SlideshowBundle\Entity\Image $image
     * @return string $recordUrl
     */
    public function getImageRecordUrl(Image $image)
    {
        return $this->fillUrl(self::RECORD_URL_PATTERN, $image);
    }   

    public function getImageQRCodeUrl(Image $image)
    {
        return $this->fillUrl(self::QR_CODE_URL_PATTERN, $image);
    }

    /**
     * Get the name of an image imageGroup
     *
     * @param Berkman\SlideshowBundle\Entity\ImageGroup $imageGroup
     * @return string $name
     */
    public function getImageGroupMetadata(ImageGroup $imageGroup)
    {
        $coverImage = $imageGroup->getCover();
        return $coverImage->getMetadata();
    }

    /**
     * Fetch the results from an image imageGroup
     *
     * @param Berkman\SlideshowBundle\Entity\ImageGroup $imageGroup
     * @return array
     */
    public function fetchImageGroupResults(ImageGroup $imageGroup, $startIndex = null, $count = null)
    {
        $results = array();
        $recordId = $imageGroup->getId1();
        $totalResults = 0;
        $i = -1;
        $metadataId = $recordId;
        $imageGroupUrl = str_replace('{id-3}', $recordId, self::METADATA_URL_PATTERN);

        $imageXpath = $this->fetchXpath($imageGroupUrl);
        $imageXpath->registerNamespace('mods', 'http://www.loc.gov/mods/v3');
        $constituents = $imageXpath->query("//mods:location");
        foreach ($constituents as $constituent) {
            $i++;
            $fullImage = $imageXpath->query(".//mods:url[@displayLabel='Full Image'][@note='unrestricted']", $constituent)->item(0);
            if ($fullImage) {
                $componentId = substr($fullImage->textContent, strpos($fullImage->textContent, ':', 5) + 1);
                $imageId = $componentId;
                $thumbnail = $imageXpath->query(".//mods:url[@displayLabel='Thumbnail']", $constituent)->item(0);
                if ($thumbnail) {
                    $thumbnailId = substr($thumbnail->textContent, strpos($thumbnail->textContent, ':', 5) + 1).'?height=150&width=150';
                    $recordIdentifier = $imageXpath->query('.//mods:recordIdentifier', $constituent->parentNode)->item(0);
                    $metadataSubId = $recordIdentifier->textContent;
                    if (!empty($thumbnailId)) {
                        if ($i >= $startIndex && count($results) < $count) {
                            $results[] = new Image(
                                $this,
                                $recordId,
                                $componentId,
                                $metadataId,
                                $metadataSubId,
                                $imageId,
                                $thumbnailId
                            );
                        }
                        $totalResults++;
                    }
                }
            }
        }

        return array('results' => $results, 'totalResults' => $totalResults);
    }

    /**
     * Note: This URL will be of the RECORD_URL_PATTERN form.
     */
    public function importImage(array $args)
    {
        $url = $args[0];
        $xpath = $this->fetchXpath($url);
        $args = array();
        parse_str(parse_url($url, PHP_URL_QUERY), $args);
        if (isset($args['recordId'], $args['componentId'])) {
            $recordId = $args['recordId'];
            $componentId = $args['componentId'];
            $metadataId = $recordId;
            $metadataSubId = null;
            $imageId = $componentId;
            $link = $xpath->query('//a[.="View large image"]')->item(0);
            if (!isset($link)) {
              return;
            }
            $container = $link->parentNode->parentNode->parentNode;
            $thumbnailUrl = $xpath->query('.//img', $container)->item(0)->getAttribute('src');
            $thumbnailId = substr($thumbnailUrl, strpos($thumbnailUrl, ':', 5) + 1);
            $image = new Image(
                $this,
                $recordId,
                $componentId,
                $metadataId,
                $metadataSubId,
                $imageId,
                $thumbnailId
            );
            return $image;
        }
    }

    public function getImportFormat()
    {
        return '"Bookmark URL"';
    }

    public function getImagesFromImport(\SplFileObject $file)
    {
        $fileContent = '';
        $images = array();
        $failed = 0;
        while (!$file->eof()) {
            $fileContent .= $file->fgets();
        }

        $doc = new \DOMDocument();
        $doc->recover = true;
        libxml_use_internal_errors(true);
        $doc->loadXML($fileContent);
        $xpath = new \DOMXPath($doc);
        $xpath->registerNamespace('ns', 'http://hul.harvard.edu/ois/xml/xsd/via/newvia_export.xsd');
        $records = $xpath->query('//ns:record');
        $totalRecords = $records->length;
        $count = 0;
        foreach ($records as $record) {
            $count++;
            $viaId = null;
            $componentId = null;
            $restricted = false;
            //error_log("Record " . $count);
            $viaNode = $xpath->query('.//ns:via_id', $record)->item(0);
            if ($viaNode) {
                $viaId = $viaNode->textContent;
            } else {
              //error_log("No via node");
            }
            $imageLinkNode = $xpath->query('.//ns:imagelink', $record)->item(0);
            if ($imageLinkNode) {
                $componentId = substr($imageLinkNode->textContent, strpos($imageLinkNode->textContent, ':', 5) + 1);
            } else {
              //error_log("No image link node");
            }
            $restrictedNode = $xpath->query('.//ns:restricted_image', $record)->item(0);
            if ($restrictedNode) {
                $restricted = ($restrictedNode->textContent == 'true') ? true : false;
            }
            //error_log("Restricted: " . ($restricted ? 'true' : 'false'));
            if (isset($viaId, $componentId) && !$restricted) {
                try { 
                    $image = $this->importImage(array(str_replace(array('{id-1}', '{id-2}'), array($viaId, $componentId), self::RECORD_URL_PATTERN)));
                    if ($image instanceof Image) {
                      $images[] = $image;
                    }
                } catch (\ErrorException $e) {
                    $failed++;
                    continue;
                }
            }
        }

        return $images;
    }

    public function getImportInstructions()
    {
        return 'Download your portfolio from VIA, extract the contents from the ZIP file, and upload your Transformed_records.xml';
    }
}
