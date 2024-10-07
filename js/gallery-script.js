jQuery(document).ready(function($) {
    console.log('Gallery script loaded');

    // Initialize Isotope
    var $grid = $('.masonry-gallery'); // Ensure this matches the class of your gallery container
    console.log('Grid element:', $grid.length);

    if ($grid.length > 0) {
        $grid.isotope({
            itemSelector: '.masonry-item', // Ensure this matches the class of your gallery items
            layoutMode: 'masonry'
        });
        console.log('Isotope initialized');
    } else {
        console.error('Grid element not found');
    }

    var $filterModal = $('#filter-modal'); // Ensure this matches the ID of your modal
    var $openFilterModalBtn = $('#trier-button'); // Ensure this matches the ID of your "Trier" button
    var $applyFiltersBtn = $('#apply-filters'); // Ensure this matches the ID of your apply filters button

    function applyFilters() {
        var filterValue = $('.filter-button.active').map(function() {
            return $(this).attr('data-filter'); // Get the data-filter attribute from active buttons
        }).get().join(', ');

        console.log('Filter value:', filterValue);

        $grid.isotope({ filter: filterValue || '*' }); // Apply the filter or show all items

        console.log('Visible items:', $grid.isotope('getFilteredItemElements').length);
    }

    // Filter button click handlers
    $('.filter-button').on('click', function() {
        $(this).toggleClass('active'); // Toggle active class on filter button
        applyFilters(); // Apply filters after toggling
    });

    // Apply filters on modal apply button click
    $applyFiltersBtn.on('click', function() {
        applyFilters(); // Apply filters when the button is clicked
        $filterModal.hide(); // Hide the modal after applying filters
    });

    // Open modal when clicking "Trier" button
    $openFilterModalBtn.on('click', function() {
        console.log('Trier button clicked'); // Debug log
        $filterModal.show(); // Show the modal
    });

    // Close modal when clicking the close button
    $('.close-button').on('click', function() {
        $filterModal.hide(); // Hide the modal
    });

    // Close modal when clicking outside of it
    $(window).on('click', function(event) {
        if (event.target.id === 'filter-modal') { // Check if the clicked target is the modal
            $filterModal.hide(); // Hide the modal
        }
    });

    // Log initial item count
    console.log('Initial item count:', $('.masonry-item').length);
});