<?php
namespace REST\PaginationExample;
use App\WP;

class Main {
    private static $pagination_data_per_page = 9;

    // Get the category tabs
    public static function public_get_categories(){
        $categories = get_categories([
            'taxonomy' => 'tax_category',
        ]);
        return $categories;
        exit;
    }

    // Pagination data
    public static function public_get_pagination_data(){
        global $neo;

        // Get page number clicked
        $page = $_GET['page'] ?? 1;

        // Main category
        $category = $_GET['category'] ?? 'all';

        // Additional queries
        $meta_query = array();
        $tax_query = array();

        // Condition query first
        if ( $category != 'all' ){
            $tax_query['tax_query'] = array(
                array(
                    'taxonomy' => 'tax_category',
                    'field' => 'id', 
                    'terms' => $category,
                )
            );
        }

        // Default query
        $query = array(
            //'s' => ( isset( $search_filters['s'] ) ? $search_filters['s'] : '' ),
            'posts_per_page' => self::$pagination_data_per_page,
            'order' => 'DESC',
            'paged' => sanitize_text_field( $page ),
            'post_type' => 'post',
        );

        // Add additional queries if set
        if ( !empty( $meta_query ) ) $query = array_merge( $query, $meta_query );
        if ( !empty( $tax_query ) ) $query = array_merge( $query, $tax_query );

        // Execute
        $query = new \WP_Query( $query );

        // Total data
        $return['total_data'] = $query->found_posts;
        $return['total_page_data'] = $query->post_count;
        $return['current_page'] = $page;

        if( $query->have_posts() ){
            while ( $query->have_posts() ) : $query->the_post(); 
                global $post;
                $data = get_fields( $post->ID );
                $data['post_details'] = $post;
                $return['data'][] = $data;
            endwhile;

            $return['pagination'] = WP\Main::Pagination( $query, $page );
        }

        return $return;
        exit;
    }
}