<?php
namespace App\WP;
class Tables {
    function __construct(){  
        //* Change CPT landing post titles
        add_filter('the_title', function($title, $postid = null){
            return $title;
        }, 10, 2);

        //* CPT landing table labels
        add_filter( 'manage_cpt_custom_posts_columns', function( $columns ){
            $columns = array(
                'cb' => $columns['cb'],
                'title' => __( 'Title' ),
                'dater' => __( 'Date' ),
            );
        
            return $columns;
        });

        // CPT landing each row
        add_action( 'manage_cpt_custom_posts_custom_column', function($column, $postid){
            if ( $column === 'dater' ){
                echo get_the_date( 'jS F Y g:ia', $postid );
            }
        
            return $column;
        }, 10, 2 );

        //* Filter features
        add_action( 'restrict_manage_posts', function(){
            if ( 
                $_GET['post_type'] === 'cpt_custom'
            ){
                wp_enqueue_style( 'jquery-ui', '//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.min.css' );
                wp_enqueue_script( 'jquery-ui-datepicker' );
        
                $from = $_GET['neoDateFrom'] ?? '';
                $to = $_GET['neoDateTo'] ?? '';
        
                echo '
                <style>
                    .tablenav .actions {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    input[name="neoDateFrom"]{
                        margin-left: 1rem;
                    }
                    input[name="neoDateFrom"], input[name="neoDateTo"]{
                        line-height: 28px;
                        height: 28px;
                        margin-right: 6px;
                        width:125px;
                    }
                    #neoExportEnquiry {
                        margin-right: 6px;
                        order: 5;
                    }
                </style>
                <input type="text" name="neoDateFrom" placeholder="Date From" value="' . $from . '" />
                <input type="text" name="neoDateTo" placeholder="Date To" value="' . $to . '" />';
            }

            ?> 
            <script>
            jQuery(function($){
                const from = $('input[name="neoDateFrom"]'), 
                to = $('input[name="neoDateTo"]');

                $('input[name="neoDateFrom"], input[name="neoDateTo"]' ).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: "dd-mm-yy"
                });

                from.on('change', function() {
                    to.datepicker('option', 'minDate', from.val() );
                });

                to.on('change', function() {
                    from.datepicker('option', 'maxDate', to.val() );
                });
            });
            </script>
            <?php
        });

        add_action( 'pre_get_posts', function( $admin_query ){
            global $pagenow, $current_user;
            
            if ( 
                isset( $_GET['post_type'] ) && 
                ( $_GET['post_type'] === 'cpt_custom' )
            ){
                if ( 
                    is_admin() && 
                    $admin_query->is_main_query() && 
                    $pagenow == 'edit.php'
                ){
                    $meta_query = array();
                    $post_type = sanitize_text_field( $_GET['post_type'] );

                    /**
                     * Sort by an ACF field
                     *
                     * $admin_query->set( 'meta_key', $post_type . '_date' );
                     * $admin_query->set( 'orderby', 'meta_value' );
                     * $admin_query->set( 'order', 'DESC' ); 
                     */

                    // Filter by dates
                    if ( !empty( $_GET['neoDateFrom'] ) ){
                        $from = sanitize_text_field( $_GET['neoDateFrom'] );

                        $useQuery = [   
                            'key' => 'cpt_custom_date',
                            'value' => date_create( $from )->format('Ymd'),
                            'compare' => 'REGEXP',
                        ];

                        if ( !empty( $_GET['neoDateTo'] ) ){
                            $to = sanitize_text_field( $_GET['neoDateTo'] );

                            $useQuery = [   
                                'key' => 'cpt_custom_date',
                                'value' => [
                                    date_create( $from )->format('Ymd'),
                                    date_create( $to )->format('Ymd')
                                ],
                                'compare' => 'BETWEEN',
                                'type'    => 'DATE',
                            ];
                        }

                        $meta_query[] = $useQuery;
                    }


                    if ( !empty( $meta_query ) ){ $admin_query->set( 'meta_query', $meta_query ); }
                }
                
                return $admin_query;
            }
        });

        //* Disable default search if want to use pre_get_post
        //* to customize search by title feature
        /*
        add_filter( 'posts_search', function ( $search, $wp_query ){
            global $wpdb;
        
            // If searching in this CPTs, dont use default search
            if ( 
                isset( $_GET['post_type'] ) && !empty($_GET['s'])
                && ($_GET['post_type'] === 'cpt_custom')
            ){
                return false;
            }
        
            return $search;
        }, 500, 2 );
        */
    }
}