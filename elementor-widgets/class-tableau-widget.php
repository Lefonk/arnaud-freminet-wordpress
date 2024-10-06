<?php
class Tableau_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'tableau_widget';
    }

    public function get_title() {
        return __( 'Tableau Widget', 'your-theme-textdomain' );
    }

    public function get_icon() {
        return 'eicon-image-box';
    }

    public function get_categories() {
        return [ 'general' ];
    }

    protected function _register_controls() {
        $this->start_controls_section(
            'content_section',
            [
                'label' => __( 'Content', 'your-theme-textdomain' ),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'tableau_id',
            [
                'label' => __( 'Tableau ID', 'your-theme-textdomain' ),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => '',
            ]
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $tableau_id = $settings['tableau_id'];

        if ( ! $tableau_id ) {
            return;
        }

        $tableau = get_post( $tableau_id );

        if ( ! $tableau || $tableau->post_type !== 'tableau' ) {
            return;
        }

        $year = get_post_meta( $tableau_id, '_artiste_tableaux_tableau_year', true );
        $medium = get_post_meta( $tableau_id, '_artiste_tableaux_tableau_medium', true );
        $dimensions = get_post_meta( $tableau_id, '_artiste_tableaux_tableau_dimensions', true );
        $status = get_post_meta( $tableau_id, '_artiste_tableaux_tableau_status', true );

        echo '<div class="tableau-widget">';
        echo '<h2>' . esc_html( $tableau->post_title ) . '</h2>';
        echo '<p>Année: ' . esc_html( $year ) . '</p>';
        echo '<p>Technique: ' . esc_html( $medium ) . '</p>';
        echo '<p>Dimensions: ' . esc_html( $dimensions ) . '</p>';
        echo '<p>Statut: ' . esc_html( $status ) . '</p>';
        echo '</div>';
    }
}