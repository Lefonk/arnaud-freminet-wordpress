jQuery(document).ready(function($) {
    // Initialize Fancybox for the gallery (if needed)
    Fancybox.bind("[data-fancybox]", {
        // Your Fancybox options here
    });

    // Custom magnifier functionality
    const mainImage = $('.main-image');
    const magnifierFrame = $('.magnifier-frame');
    const tableauDetails = $('.tableau-details-wrapper');
    const zoomedContainer = $('.zoomed-image-container');
    const zoomFactor = parseFloat(mainImage.data('zoom-factor')) || 3; // Dynamic zoom factor

    if (mainImage.length) {
        const fullImageSrc = mainImage.data('full-image');

        if (!fullImageSrc) {
            console.error("Full image source not found. Please ensure the data-full-image attribute is correctly set.");
            return;
        }

        // Create the zoomed image with error handling
        const zoomedImage = $('<img>', {
            src: fullImageSrc,
            class: 'zoomed-image',
            alt: mainImage.attr('alt') || 'Zoomed image',
            draggable: false // Prevent image dragging
        });

        // Add zoomedImage to zoomedContainer
        zoomedContainer.append(zoomedImage);

        let imagesLoaded = 0;

        // Wait for the zoomed image to load
        zoomedImage.on('load', function() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                initializeMagnifier();
            }
        }).on('error', function() {
            console.error("Failed to load zoomed image. Please check the data-full-image attribute.");
            $(this).remove();
        });

        // Ensure the main image is loaded before continuing
        mainImage.on('load', function() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                initializeMagnifier();
            }
        }).each(function() {
            if (this.complete) $(this).trigger('load');
        });

        function initializeMagnifier() {
            const imageWidth = mainImage.width();
            const imageHeight = mainImage.height();

            // Set the dimensions of the zoomed image based on the zoom factor
            zoomedImage.css({
                width: imageWidth * zoomFactor,
                height: imageHeight * zoomFactor,
                position: 'absolute'
            });

            // Proceed with the rest of the magnifier functionality
            setupMagnifierEvents();
        }

        function setupMagnifierEvents() {
            // Handle mouse movement
            let isThrottled = false;

            // Check if the device is mobile
            const isMobile = $(window).width() < 768;

            if (!isMobile) {
                mainImage.on('mousemove', function(e) {
                    if (!isThrottled) {
                        window.requestAnimationFrame(function() {
                            handleMouseMove(e);
                            isThrottled = false;
                        });
                        isThrottled = true;
                    }
                });

                // Show the magnifier on hover
                mainImage.on('mouseenter', function() {
                    magnifierFrame.show();
                    zoomedContainer.show();
                });

                // Hide the magnifier when leaving the image
                mainImage.on('mouseleave', function() {
                    magnifierFrame.hide();
                    zoomedContainer.hide();
                    tableauDetails.show();
                });
            } else {
                // On mobile, hide the magnifier frame and zoom container
                magnifierFrame.hide();
                zoomedContainer.hide();
            }

            // Prevent the container from capturing mouse events
            magnifierFrame.css('pointer-events', 'none');
            zoomedContainer.css('pointer-events', 'none');
        }

        function handleMouseMove(e) {
            const imageOffset = mainImage.offset();
            const mouseX = e.pageX - imageOffset.left;
            const mouseY = e.pageY - imageOffset.top;

            const imageWidth = mainImage.width();
            const imageHeight = mainImage.height();

            // Ensure the mouse is over the image
            if (mouseX < 0 || mouseY < 0 || mouseX > imageWidth || mouseY > imageHeight) {
                magnifierFrame.hide();
                zoomedContainer.hide();
                return;
            }

            // Calculate the position of the magnifier frame
            const magnifierWidth = magnifierFrame.width();
            const magnifierHeight = magnifierFrame.height();

            let frameLeft = mouseX - (magnifierWidth / 2);
            let frameTop = mouseY - (magnifierHeight / 2);

            // Constrain the frame to stay within the image bounds
            frameLeft = Math.max(0, Math.min(frameLeft, imageWidth - magnifierWidth));
            frameTop = Math.max(0, Math.min(frameTop, imageHeight - magnifierHeight));

            magnifierFrame.css({
                left: frameLeft + 'px',
                top: frameTop + 'px',
                display: 'block'
            });

            tableauDetails.hide();

            // Calculate the position of the zoomed image in the container
            const zoomedImageWidth = zoomedImage.width();
            const zoomedImageHeight = zoomedImage.height();
            const zoomedContainerWidth = zoomedContainer.width();
            const zoomedContainerHeight = zoomedContainer.height();

            // Calculate the relative position of the frame in the main image
            const relativeX = frameLeft / (imageWidth - magnifierWidth);
            const relativeY = frameTop / (imageHeight - magnifierHeight);

            // Calculate the offset of the zoomed image
            const zoomX = -relativeX * (zoomedImageWidth - zoomedContainerWidth);
            const zoomY = -relativeY * (zoomedImageHeight - zoomedContainerHeight);

            zoomedImage.css({
                left: zoomX + 'px',
                top: zoomY + 'px'
            });

            // Ensure the magnifier elements are visible
            magnifierFrame.show();
            zoomedContainer.show();
        }
    }

    // Hide the magnifier and zoom container on smaller screens
    function checkScreenSize() {
        if ($(window).width() < 768) {
            magnifierFrame.hide();
            zoomedContainer.hide();
        }
    }

    // Check screen size on load and resize
    $(window).on('load resize', checkScreenSize);

    const fullscreenIcon = $('#fullscreen-icon');
    
    fullscreenIcon.on('click', function() {
        toggleFullScreen();
    });

    function toggleFullScreen() {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
            if (mainImage[0].requestFullscreen) {
                mainImage[0].requestFullscreen();
            } else if (mainImage[0].msRequestFullscreen) {
                mainImage[0].msRequestFullscreen();
            } else if (mainImage[0].mozRequestFullScreen) {
                mainImage[0].mozRequestFullScreen();
            } else if (mainImage[0].webkitRequestFullscreen) {
                mainImage[0].webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            fullscreenIcon.html('<span>&#x26F7;</span>'); // Change icon to exit fullscreen
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            fullscreenIcon.html('<span>&#x26F6;</span>'); // Change icon back to enter fullscreen
        }
    }

    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('mozfullscreenchange', onFullScreenChange);
    document.addEventListener('MSFullscreenChange', onFullScreenChange);

    function onFullScreenChange() {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
            fullscreenIcon.html('<span>&#x26F6;</span>'); // Change icon back to enter fullscreen
        }
    }

    // Initialize Isotope
    var $grid = $('#tableau-container').isotope({
        itemSelector: '.card',
        layoutMode: 'fitRows'
    });

    var $filterModal = $('#filter-modal');
    var $openFilterModalBtn = $('#open-filter-modal');
    var $applyFiltersBtn = $('#apply-filters');

    function applyFilters() {
        var activeFilters = {};

        $('.filter-button.active').each(function() {
            var $button = $(this);
            var type = $button.data('type');
            var slug = $button.data('slug');
            
            if (!activeFilters[type]) {
                activeFilters[type] = [];
            }
            activeFilters[type].push('.' + type + '-' + slug);
        });

        console.log('Active filters:', activeFilters);

        var filterValue = '';
        for (var type in activeFilters) {
            if (activeFilters[type].length > 0) {
                if (filterValue) filterValue += ', ';
                filterValue += activeFilters[type].join(', ');
            }
        }

        console.log('Filter value:', filterValue);

        $grid.isotope({ filter: filterValue || '*' });
        
        console.log('Visible items:', $grid.data('isotope').filteredItems.length);
    }

    // Desktop filter functionality
    $('.desktop-filters .filter-button').on('click', function() {
        console.log('Desktop filter clicked:', $(this).data('type'), $(this).data('slug'));
        $(this).toggleClass('active');
        applyFilters();
    });

    // Mobile filter functionality
    $('.filter-modal .filter-button').on('click', function() {
        console.log('Mobile filter clicked:', $(this).data('type'), $(this).data('slug'));
        $(this).toggleClass('active');
    });

    $applyFiltersBtn.on('click', function() {
        console.log('Apply filters clicked');
        applyFilters();
        $filterModal.css('display', 'none');
    });

    // Open modal when clicking "Trier" button
    $openFilterModalBtn.on('click', function() {
        console.log('Open filter modal clicked');
        $filterModal.css('display', 'block');
    });

    // Close modal when clicking outside of it
    $(window).on('click', function(event) {
        if (event.target == $filterModal[0]) {
            $filterModal.css('display', 'none');
        }
    });
});