document.addEventListener('DOMContentLoaded', function () {
    const tableauContainer = document.getElementById('tableau-container');

    // Check if tableauContainer exists
    if (!tableauContainer) {
        console.error('Tableau container not found!');
        return; // Exit if the container is not found
    }

    // Initialize Isotope
    const iso = new Isotope(tableauContainer, {
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    const filterButtons = document.querySelectorAll('.filter-button');
    const clearFiltersButton = document.getElementById('clear-filters');
    let activeFilters = {
        category: new Set(),
        tag: new Set()
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const type = this.dataset.type;
            const slug = this.dataset.slug;

            if (type && slug) {
                if (activeFilters[type].has(slug)) {
                    activeFilters[type].delete(slug);
                    this.classList.remove('active');
                } else {
                    activeFilters[type].add(slug);
                    this.classList.add('active');
                }

                filterTableaux();
            }
        });
    });

    clearFiltersButton.addEventListener('click', function () {
        activeFilters.category.clear();
        activeFilters.tag.clear();
        filterButtons.forEach(button => button.classList.remove('active'));
        filterTableaux();
    });

    function filterTableaux() {
        const filterValues = [];

        if (activeFilters.category.size > 0) {
            filterValues.push([...activeFilters.category].map(cat => `.category-${cat}`).join(', '));
        }

        if (activeFilters.tag.size > 0) {
            filterValues.push([...activeFilters.tag].map(tag => `.tag-${tag}`).join(', '));
        }

        const filterValue = filterValues.length > 0 ? filterValues.join(', ') : '*';
        iso.arrange({ filter: filterValue });
    }
});