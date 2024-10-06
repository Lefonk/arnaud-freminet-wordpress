<?php
get_header();
?>
<div id="fullscreen-icon" class="fullscreen-icon">
    <span>&#x26F6;</span>
</div>
<main id="site-content" role="main">

    <?php
    if ( have_posts() ) {
        while ( have_posts() ) {
            the_post();
            
            // Get custom field values
            $year = get_post_meta( get_the_ID(), '_artiste_tableaux_tableau_year', true );
            $medium = get_post_meta( get_the_ID(), '_artiste_tableaux_tableau_medium', true );
            $dimensions = get_post_meta( get_the_ID(), '_artiste_tableaux_tableau_dimensions', true );
            $status = get_post_meta( get_the_ID(), '_artiste_tableaux_tableau_status', true );
            $additional_images = get_post_meta( get_the_ID(), '_artiste_tableaux_tableau_additional_images', true );
            $image_captions = get_post_meta( get_the_ID(), '_artiste_tableaux_image_captions', true );
            $captions = !empty($image_captions) ? explode(',', $image_captions) : [];
            ?>
            
            <article <?php post_class(); ?> id="post-<?php the_ID(); ?>">
                <div class="entry-content">
    <div class="tableau-all">
        <div class="tableau-main-image">
            <?php 
            if ( has_post_thumbnail() ) {
                $full_image_url = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full' )[0];
                $large_image_url = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large' )[0];
                $medium_image_url = wp_get_attachment_image_src( get_post_thumbnail_id(), 'medium' )[0];
                ?>
                <div class="image-magnifier-container">
                    <img id="main-tableau-image" src="<?php echo esc_url($large_image_url ); ?>" alt="<?php the_title_attribute(); ?>" class="main-image" data-full-image="<?php echo esc_url( $full_image_url ); ?>">
                    <div class="magnifier-frame"></div>
                    <?php if ($status === 'vendu') : ?>
                        <div class="status-circle"></div> <!-- Cercle rouge ici -->
                    <?php endif; ?>
                </div>
            <?php
            }
            ?>
        </div>
        <div class="tableau-details-wrapper">
        <div class="topContainer">
            <div class="tableau-description">
                <h1 class="entry-title top"><?php the_title(); ?></h1>
                <?php the_content(); ?>
            </div>
            <div class="tableau-details">
                <p><strong><?php _e( 'Année', 'text_domain' ); ?></strong> <?php echo esc_html( $year ); ?></p>
            <p><strong><?php _e( 'Technique', 'text_domain' ); ?></strong> <?php echo esc_html( $medium ); ?></p>
            <p><strong><?php _e( 'Dimensions', 'text_domain' ); ?></strong> <?php echo esc_html( $dimensions ); ?></p>
            <p><strong><?php _e( 'Statut', 'text_domain' ); ?></strong> 
                <span class="status-<?php echo esc_attr($status); ?>">
                    <?php echo esc_html( $status === 'disponible' ? __( 'Disponible', 'text_domain' ) : __( 'Vendu', 'text_domain' ) ); ?>
                </span>
            </p>
        </div>
        </div>
        <div class="bottomContainer">
        <div class="tableau-navigation">
        
            <?php
            $prev_post = get_previous_post();
            $next_post = get_next_post();
            ?>
            <?php if (!empty($prev_post)) : ?>
                <a href="<?php echo get_permalink($prev_post->ID); ?>" class="nav-button prev-tableau" data-id="<?php echo $prev_post->ID; ?>">
                    &larr; Tableau précédent
                </a>
            <?php endif; ?>
            <?php if (!empty($next_post)) : ?>
                <a href="<?php echo get_permalink($next_post->ID); ?>" class="nav-button next-tableau" data-id="<?php echo $next_post->ID; ?>">
                    Tableau suivant &rarr;
                </a>
            <?php endif; ?>
        </div>
        </div>
        </div>
        <div class="zoomed-image-container"></div>
    </div>
</div>
                    
<?php
if ( has_post_thumbnail() ) {
    $full_image_url = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full' )[0];
    $thumbnail_url = wp_get_attachment_image_src( get_post_thumbnail_id(), 'thumbnail' )[0];
    // Assurez-vous que ces variables contiennent des valeurs valides
}
?>  

                    <?php if ( $additional_images ) : ?>
                        <div class="tableau-additional-images">
                        <?php if ( has_post_thumbnail() ) : ?>
    <div class="tableau-image">
        <a href="<?php echo esc_url($full_image_url); ?>" class="additional-image" data-fancybox="gallery" data-full-image="<?php echo esc_url($full_image_url); ?>">
            <img src="<?php echo esc_url($thumbnail_url); ?>" alt="<?php echo esc_attr( $caption ); ?>">
        </a>
        <p class="image-caption"><?php echo esc_html( $caption ); ?></p>
    </div>
<?php endif; ?>
                            <?php
                            $image_ids = explode( ',', $additional_images );
                            foreach ( $image_ids as $index => $image_id ) :
                                $full_image_url = wp_get_attachment_image_src( $image_id, 'full' )[0];
                                $thumbnail_url = wp_get_attachment_image_src( $image_id, 'thumbnail' )[0];
                                $caption = isset($captions[$index]) ? $captions[$index] : '';
                            ?>
                                <div class="tableau-image">
                                    <a href="<?php echo esc_url( $full_image_url ); ?>" data-fancybox="gallery" data-full-image="<?php echo esc_url( $full_image_url ); ?>" data-caption="<?php echo esc_attr( $caption ); ?>" class="additional-image">
                                        <img src="<?php echo esc_url( $thumbnail_url ); ?>" alt="<?php echo esc_attr( $caption ); ?>">
                                    </a>
                                    <?php if ( $caption ) : ?>
                                        <p class="image-caption"><?php echo esc_html( $caption ); ?></p>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <div class="tableau-categories-tags">
                        <?php
                        $categories_list = get_the_category_list( esc_html__( ', ', 'text_domain' ) );
                        if ( $categories_list ) {
                            printf( '<p class="cat-links">' . esc_html__( 'Catégories: %1$s', 'text_domain' ) . '</p>', $categories_list );
                        }

                        $tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'text_domain' ) );
                        if ( $tags_list ) {
                            printf( '<p class="tags-links">' . esc_html__( 'Tags: %1$s', 'text_domain' ) . '</p>', $tags_list );
                        }
                        ?>
                    </div>
                </div>
            </article>
            <?php
        }
    }
    ?>

</main>

<?php
get_footer();
?>