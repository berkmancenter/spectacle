<?php

namespace Berkman\CatalogBundle\Command;

use Berkman\CatalogBundle\Entity\Finder;
use Berkman\CatalogBundle\Catalog\CatalogManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class SearchCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('spectacle:search')
            ->setDescription('Output search results as CSV')
            ->addArgument('keyword', InputArgument::REQUIRED, 'What do you want to search for?')
            ->addArgument('results', InputArgument::OPTIONAL, 'How many results do you want?')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $columns = array( 'Title',
                          'Description',
                          'Image URL',
                          'Record URL',
                          'Thumbnail URL',
                          'Date Created',
                          'Creator');

        $csv = $this->sputcsv($columns);
        $catalog_manager = new CatalogManager(array('VIA'));
        $finder = new Finder($catalog_manager);
        $keyword = $input->getArgument('keyword');
        $desired_results = $input->getArgument('results');
        if (is_null($desired_results)) {
            $desired_results = 25;
        }
        elseif (strtolower($desired_results) == 'all') {
            $desired_results = 1000000;
        }
        else {
            $desired_results = intval($desired_results);
        }
        $result_count = 0;
        $current_page = 1;
        $results = $finder->findResults($keyword);
        $total_pages = ceil($results['totalResults'] / 25);

        while ($result_count < $desired_results && $current_page <= $total_pages) {

            $finder->findResults($keyword, $current_page);

            foreach ($finder->getImages() as $image) {
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
                $result_count++;
                if ($result_count > $desired_results) { break 2; }
                $csv .= $this->sputcsv($image_output);
            }

            foreach ($finder->getImageGroups() as $image_group) {
                $all_images = $image_group->getAllImages();
                foreach ($all_images as $image) {
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
                    $result_count++;
                    if ($result_count > $desired_results) { break 2; }
                    $csv .= $this->sputcsv($image_output);
                }
            }

            $current_page++;
        }

        $output->writeln($csv);
    }
    protected function sputcsv($row, $delimiter = ',', $enclosure = '"', $eol = "\n")
    {
        static $fp = false;
        if ($fp === false)
        {
            $fp = fopen('php://temp', 'r+'); // see http://php.net/manual/en/wrappers.php.php - yes there are 2 '.php's on the end.
            // NB: anything you read/write to/from 'php://temp' is specific to this filehandle
        }
        else
        {
            rewind($fp);
        }

        if (fputcsv($fp, $row, $delimiter, $enclosure) === false)
        {
            return false;
        }

        rewind($fp);
        $csv = fgets($fp);

        if ($eol != PHP_EOL)
        {
            $csv = substr($csv, 0, (0 - strlen(PHP_EOL))) . $eol;
        }

        return $csv;
    }
}
