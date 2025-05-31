document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times'); // Change icon to 'X'
        });

        // Close nav when a link is clicked (for smooth scrolling)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    navToggle.querySelector('i').classList.remove('fa-times');
                    navToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href'); // Get the href value (e.g., "#services")
            const targetElement = document.querySelector(targetId); // Find the element by its ID

            if (targetElement) {
                // Calculate position considering fixed header (if any)
                const headerOffset = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Update Current Year in Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 4. Contact Form Submission (Now handled by Formspree, so no client-side JS needed here)
    // The previous JavaScript block for form submission has been removed/commented out.
    // Formspree handles the submission directly via the 'action' and 'method' attributes in index.html.


    // Modal Elements
    const detailModal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalBody = detailModal.querySelector('.modal-body'); // To insert dynamic icons/images
    const closeButton = detailModal.querySelector('.close-button');


    // Function to open the modal
    function openModal(itemData) {
        modalTitle.textContent = itemData.title;
        modalDescription.textContent = itemData.description;

        // Clear previous content in modalBody and add the icon
        modalBody.innerHTML = `<i class="${itemData.icon} icon"></i>`;

        // If you had imageUrl in data.json, you would add logic here
        // if (itemData.imageUrl) {
        //     const img = document.createElement('img');
        //     img.src = itemData.imageUrl;
        //     img.alt = itemData.title;
        //     img.className = 'modal-image'; // Add a class for styling
        //     modalBody.appendChild(img);
        // }


        detailModal.classList.add('active'); // Show the modal
    }

    // Function to close the modal
    function closeModal() {
        detailModal.classList.remove('active'); // Hide the modal
    }

    // Event listeners for closing the modal
    closeButton.addEventListener('click', closeModal);
    detailModal.addEventListener('click', function(event) {
        // If clicked directly on the modal overlay (not the content inside)
        if (event.target === detailModal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            closeModal();
        }
    });


    // NEW FUNCTIONALITY: Dynamically load Services and Products and attach click handlers
    function loadServicesAndProducts() {
        fetch('js/data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const servicesGrid = document.getElementById('servicesGridContainer');
                const productsGrid = document.getElementById('productsGridContainer');

                // Helper function to create and append items
                function createGridItem(item, type) {
                    const itemElement = document.createElement('div');
                    itemElement.className = `${type}-item`; // 'service-item' or 'product-item'
                    itemElement.innerHTML = `
                        <i class="${item.icon} icon"></i>
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    `;
                    // Attach click listener to open modal
                    itemElement.addEventListener('click', () => openModal(item));
                    return itemElement;
                }

                if (servicesGrid) {
                    servicesGrid.innerHTML = ''; // Clear existing loading message
                    data.services.forEach(service => {
                        servicesGrid.appendChild(createGridItem(service, 'service'));
                    });
                }

                if (productsGrid) {
                    productsGrid.innerHTML = ''; // Clear existing loading message
                    data.products.forEach(product => {
                        productsGrid.appendChild(createGridItem(product, 'product'));
                    });
                }
            })
            .catch(error => console.error('Error loading data:', error));
    }

    // Call the function to load data when the page loads
    loadServicesAndProducts();
    // 5. FAQ Accordion Functionality
const faqQuestions = document.querySelectorAll('.faq-question');

if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle the 'active' class on the parent faq-item
            const faqItem = this.closest('.faq-item');
            faqItem.classList.toggle('active');

            // Close other open FAQs if desired (optional)
            faqQuestions.forEach(otherQuestion => {
                const otherFaqItem = otherQuestion.closest('.faq-item');
                if (otherFaqItem !== faqItem && otherFaqItem.classList.contains('active')) {
                    otherFaqItem.classList.remove('active');
                }
            });
        });
    });
}
});