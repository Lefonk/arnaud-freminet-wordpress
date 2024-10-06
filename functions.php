<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_CHILD_VERSION', '2.0.0' );

function hello_elementor_child_scripts_styles() {
    wp_enqueue_style(
        'hello-elementor-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        ['hello-elementor-theme-style'],
        HELLO_ELEMENTOR_CHILD_VERSION
    );
}
add_action( 'wp_enqueue_scripts', 'hello_elementor_child_scripts_styles' );

function enqueue_tableau_frontend_scripts() {
    if ( is_page( 'oeuvres' ) || is_singular( 'tableau' )) {
        wp_enqueue_style( 'tableau-style', get_stylesheet_directory_uri() . '/css/tableau-style.css', array(), '1.0' );
        wp_enqueue_style( 'fancybox-css', 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css' );
        wp_enqueue_script( 'fancybox-js', 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js', array(), '4.0', true );
        wp_enqueue_script( 'isotope-js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.isotope/3.0.6/isotope.pkgd.min.js', array('jquery'), null, true );
        wp_enqueue_script( 'imagesloaded-js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/4.1.4/imagesloaded.pkgd.min.js', array('jquery'), null, true );
        wp_enqueue_script( 'tableau-script', get_stylesheet_directory_uri() . '/js/tableau-script.js', array('jquery', 'isotope-js', 'imagesloaded-js'), '1.0', true );
    }
}
add_action( 'wp_enqueue_scripts', 'enqueue_tableau_frontend_scripts' );

// Function to get all categories and tags for tableaux
function get_tableau_filters() {
    $categories = get_terms([
        'taxonomy' => 'category',
        'hide_empty' => true,
    ]);

    $tags = get_terms([
        'taxonomy' => 'post_tag',
        'hide_empty' => true,
    ]);

    return [
        'categories' => $categories,
        'tags' => $tags,
    ];
}

function display_tableau_filters() {
    $filters = get_tableau_filters();

    // Desktop filters
    echo '<div class="tableau-filters desktop-filters">';
    foreach ($filters as $filter_type => $terms) {
        foreach ($terms as $term) {
            echo '<button class="filter-button" data-type="' . esc_attr($filter_type) . '" data-slug="' . esc_attr($term->slug) . '">
                <span class="button-text">' . esc_html($term->name) . '</span>
                <span class="active-text">✓ ' . esc_html($term->name) . '</span>
            </button>';
        }
    }
    echo '<button id="clear-filters">Clear Filters</button>';
    echo '</div>';

    // Mobile filter button
    echo '<button id="open-filter-modal" class="filter-button mobile-filter">Trier</button>';

    // Mobile filter modal
    echo '<div id="filter-modal" class="filter-modal">';
    echo '<div class="filter-modal-content">';
    echo '<h2>Filtres</h2>';
    
    foreach ($filters as $filter_type => $terms) {
        foreach ($terms as $term) {
            echo '<button class="filter-button" data-type="' . esc_attr($filter_type) . '" data-slug="' . esc_attr($term->slug) . '">
                <span class="button-text">' . esc_html($term->name) . '</span>
                <span class="active-text">✓ ' . esc_html($term->name) . '</span>
            </button>';
        }
    }

    echo '<button id="apply-filters" class="apply-filters-button">Valider</button>';
    echo '</div>';
    echo '</div>';
}

// Function to display tableaux by category and/or tags
function display_tableaux_by_category_and_tags() {
    $args = [
        'post_type'      => 'tableau',
        'posts_per_page' => -1, // Get all posts
    ];

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        echo '<div id="tableau-container" class="post-cards">';
        while ($query->have_posts()) {
            $query->the_post();
            $categories = get_the_category();
            $tags = get_the_tags();

            $category_classes = array_map(function($cat) {
                return 'category-' . esc_attr($cat->slug);
            }, $categories);

            $tag_classes = $tags ? array_map(function($tag) {
                return 'tag-' . esc_attr($tag->slug);
            }, $tags) : [];

            $all_classes = array_merge($category_classes, $tag_classes);

            echo '<div class="card grid-item ' . implode(' ', $all_classes) . '">';
            echo '<a href="' . get_permalink() . '">';
            if (has_post_thumbnail()) {
                echo '<div class="image-container">';
                echo get_the_post_thumbnail(get_the_ID(), 'large');
                echo '<div class="overlay">';
                echo '<h3>' . get_the_title() . '</h3>';
                echo '</div>'; // Close overlay
                echo '</div>'; // Close image-container
            }
            echo '</a>';
            echo '</div>'; // Close card
        }
        echo '</div>'; // Close post-cards
    } else {
        echo 'Pas de tableaux avec ces critères';
    }

    wp_reset_postdata();
}

// Shortcode to use the display function
function tableaux_shortcode() {
    ob_start();
    display_tableau_filters();
    display_tableaux_by_category_and_tags();
    return ob_get_clean();
}
add_shortcode('tableaux', 'tableaux_shortcode');