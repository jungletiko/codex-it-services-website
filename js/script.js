document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navbarToggle');
    const navLinks = document.getElementById('navLinks');
    const servicesGrid = document.getElementById('servicesGrid');
    const productsGrid = document.getElementById('productsGrid');
    const modalContainer = document.getElementById('modalContainer');
    const teamGrid = document.getElementById('teamGrid'); // New
    const testimonialCarousel = document.getElementById('testimonialCarousel'); // New
    const clientLogosGrid = document.getElementById('clientLogosGrid'); // New

    let allData = {}; // Store all fetched data

    // 1. Navbar Toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close navbar when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // Function to create and append modals
    function createModal(item) {
        const modal = document.createElement('div');
        modal.id = `${item.id}Modal`;
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" data-modal-id="${item.id}Modal">&times;</span>
                <h3>${item.title} Details</h3>
                <p><strong>Description:</strong> ${item.description}</p>
                <p>${item.details}</p>
                ${item.benefits ? `
                <h4>Benefits:</h4>
                <ul>
                    ${item.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
        `;
        modalContainer.appendChild(modal);

        // Add event listener to close button
        modal.querySelector('.close-button').addEventListener('click', function() {
            document.getElementById(this.dataset.modalId).style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Function to render Services
    function renderServices(services) {
        if (!servicesGrid) return;
        servicesGrid.innerHTML = ''; // Clear existing content
        services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <i class="${service.icon}"></i>
                <h4>${service.title}</h4>
                <p>${service.description}</p>
                <button class="btn btn-secondary view-details" data-item-id="${service.id}" data-item-type="service">View Details</button>
            `;
            servicesGrid.appendChild(serviceItem);
        });
        addModalListeners('service');
    }

    // Function to render Products
    function renderProducts(products) {
        if (!productsGrid) return;
        productsGrid.innerHTML = ''; // Clear existing content
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <i class="${product.icon}"></i>
                <h4>${product.title}</h4>
                <p>${product.description}</p>
                <button class="btn btn-secondary view-details" data-item-id="${product.id}" data-item-type="product">View Details</button>
            `;
            productsGrid.appendChild(productItem);
        });
        addModalListeners('product');
    }

    // New: Function to render Testimonials
    function renderTestimonials(testimonials) {
        if (!testimonialCarousel) return;
        testimonialCarousel.innerHTML = ''; // Clear existing content
        testimonials.forEach(testimonial => {
            const testimonialItem = document.createElement('div');
            testimonialItem.classList.add('testimonial-item');
            testimonialItem.innerHTML = `
                <div class="testimonial-quote">"${testimonial.quote}"</div>
                <div class="testimonial-author">
                    <img src="${testimonial.avatar}" alt="${testimonial.author}" class="author-avatar">
                    <p><strong>${testimonial.author}</strong><br>${testimonial.title}</p>
                </div>
            `;
            testimonialCarousel.appendChild(testimonialItem);
        });
    }

    // New: Function to render Team Members
    function renderTeam(team) {
        if (!teamGrid) return;
        teamGrid.innerHTML = ''; // Clear existing content
        team.forEach(member => {
            const teamMemberDiv = document.createElement('div');
            teamMemberDiv.classList.add('team-member');
            teamMemberDiv.innerHTML = `
                <img src="${member.avatar}" alt="${member.name}" class="team-avatar">
                <h4>${member.name}</h4>
                <p class="team-title">${member.title}</p>
                <p class="team-bio">${member.bio}</p>
                <div class="team-social">
                    ${member.social && member.social.linkedin ? `<a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${member.social && member.social.twitter ? `<a href="${member.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                </div>
            `;
            teamGrid.appendChild(teamMemberDiv);
        });
    }

    // New: Function to render Client Logos
    function renderClients(clients) {
        if (!clientLogosGrid) return;
        clientLogosGrid.innerHTML = ''; // Clear existing content
        clients.forEach(client => {
            const clientLogoItem = document.createElement('div');
            clientLogoItem.classList.add('client-logo-item');
            clientLogoItem.innerHTML = `
                <a href="${client.link}" target="_blank" rel="noopener noreferrer">
                    <img src="${client.logo}" alt="${client.name} Logo">
                </a>
            `;
            clientLogosGrid.appendChild(clientLogoItem);
        });
    }

    // Add click listeners to "View Details" buttons for modals
    function addModalListeners(type) {
        document.querySelectorAll(`.view-details[data-item-type="${type}"]`).forEach(button => {
            button.removeEventListener('click', handleViewDetailsClick); // Prevent duplicate listeners
            button.addEventListener('click', handleViewDetailsClick);
        });
    }

    function handleViewDetailsClick() {
        const itemId = this.dataset.itemId;
        const itemType = this.dataset.itemType;
        let itemData;

        if (itemType === 'service') {
            itemData = allData.services.find(s => s.id === itemId);
        } else if (itemType === 'product') {
            itemData = allData.products.find(p => p.id === itemId);
        }

        if (itemData) {
            let modal = document.getElementById(`${itemData.id}Modal`);
            if (!modal) {
                createModal(itemData); // Create modal if it doesn't exist
                modal = document.getElementById(`${itemData.id}Modal`);
            }
            modal.style.display = 'block'; // Show the modal
        }
    }

    // Fetch data and render all sections
    fetch('js/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allData = data; // Store all fetched data
            renderServices(allData.services);
            renderProducts(allData.products);
            renderTestimonials(allData.testimonials); // Render testimonials
            renderTeam(allData.team); // Render team members
            renderClients(allData.clients); // Render client logos

            // Initialize all modals when data is loaded
            allData.services.forEach(service => createModal(service));
            allData.products.forEach(product => createModal(product));
        })
        .catch(error => console.error('Error fetching data:', error));

    // FAQ Accordion Functionality (existing code)
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
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

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore empty href
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('.navbar').offsetHeight + 20), // Adjust for fixed navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

});