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

        function initializeMagnifier() {
            const imageWidth = mainImage.width();
            const imageHeight = mainImage.height();

            zoomedImage.css({
                width: imageWidth * zoomFactor,
                height: imageHeight * zoomFactor,
                position: 'absolute'
            });

            setupMagnifierEvents();
        }

        function setupMagnifierEvents() {
            let isThrottled = false;
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

                mainImage.on('mouseenter', function() {
                    magnifierFrame.show();
                    zoomedContainer.show();
                });

                mainImage.on('mouseleave', function() {
                    magnifierFrame.hide();
                    zoomedContainer.hide();
                    tableauDetails.show();
                });
            } else {
                magnifierFrame.hide();
                zoomedContainer.hide();
            }

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

        // Image Loaded Check for Magnifier
        zoomedImage.on('load', function() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                initializeMagnifier();
            }
        }).on('error', function() {
            console.error("Failed to load zoomed image. Please check the data-full-image attribute.");
            $(this).remove();
        });

        mainImage.on('load', function() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                initializeMagnifier();
            }
        }).each(function() {
            if (this.complete) $(this).trigger('load');
        });
    }

    // Hide magnifier on smaller screens
    $(window).on('load resize', function() {
        if ($(window).width() < 768) {
            magnifierFrame.hide();
            zoomedContainer.hide();
        }
    });

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
});