jQuery(document).ready(function($) {
    const painting = document.getElementById('painting');
    const zoomArea = document.getElementById('zoomArea');
    const thumbnails = document.querySelectorAll('.thumbnail');

    function updateZoom(e) {
        const rect = painting.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        zoomArea.style.display = 'block';
        zoomArea.style.left = `${Math.min(Math.max(x - 100, 0), rect.width - 200)}px`;
        zoomArea.style.top = `${Math.min(Math.max(y - 100, 0), rect.height - 200)}px`;

        const zoomX = (x / rect.width) * 100;
        const zoomY = (y / rect.height) * 100;

        zoomArea.style.backgroundImage = `url(${painting.src})`;
        zoomArea.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
        zoomArea.style.backgroundSize = `${painting.width * 3}px ${painting.height * 3}px`;
    }

    painting.addEventListener('mousemove', updateZoom);
    painting.addEventListener('mouseleave', () => {
        zoomArea.style.display = 'none';
    });

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            painting.src = thumbnail.src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
    });
});