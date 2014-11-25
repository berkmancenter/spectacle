<?php
namespace Berkman\CatalogBundle\Tests\Service;

use Berkman\CatalogBundle\Service\OasisFinder;

class OasisFinderTest extends \PHPUnit_Framework_TestCase
{
    public function testAdd()
    {
        $via = new OasisFinder();
        $results = $via->search('harvard', 20, 0);
    }
}
