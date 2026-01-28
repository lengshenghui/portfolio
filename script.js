document.addEventListener('DOMContentLoaded', function () {
    // Portfolio password protection
    const portfolioPasswordOverlay = document.getElementById('portfolio-password-overlay');
    const portfolioContent = document.getElementById('portfolio-content');
    const portfolioPasswordInput = document.getElementById('portfolio-password');
    const portfolioSubmitBtn = document.getElementById('portfolio-submit');
    const passwordError = document.getElementById('password-error');
    const togglePasswordBtn = document.getElementById('toggle-password');

    // The password hash for accessing the portfolio section
    // Using SHA-256 hash of the password instead of storing it directly
    const correctPasswordHash = "d2ad2cc338783d07af4fcc60aa21a560d81a574670e2f67f5a6adb9b78503766"; // Hash of your actual password

    // Check if user has already entered the correct password in this session
    if (sessionStorage.getItem('portfolioPasswordEntered') === 'true') {
        portfolioPasswordOverlay.classList.add('hidden');
        portfolioContent.classList.remove('hidden');
    }

    // Handle password submission
    portfolioSubmitBtn.addEventListener('click', function () {
        checkPortfolioPassword();
    });

    // Also check password when Enter key is pressed
    portfolioPasswordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkPortfolioPassword();
        }
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function () {
        // Toggle the password input type between "password" and "text"
        const type = portfolioPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        portfolioPasswordInput.setAttribute('type', type);

        // Toggle the eye icon
        const eyeIcon = togglePasswordBtn.querySelector('i');
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');

        // Update the aria-label for accessibility
        togglePasswordBtn.setAttribute('aria-label',
            type === 'password' ? 'Show password' : 'Hide password');
    });

    function checkPortfolioPassword() {
        const enteredPassword = portfolioPasswordInput.value;

        // Hash the entered password using SHA-256
        hashPassword(enteredPassword).then(hashedPassword => {
            if (hashedPassword === correctPasswordHash) {
                // Password is correct
                portfolioPasswordOverlay.classList.add('hidden');
                portfolioContent.classList.remove('hidden');
                passwordError.textContent = '';

                // Save in session storage so user doesn't have to enter password again
                sessionStorage.setItem('portfolioPasswordEntered', 'true');
            } else {
                // Password is incorrect
                passwordError.textContent = 'Incorrect password. Please try again.';
                portfolioPasswordInput.value = '';
                portfolioPasswordInput.focus();
            }
        });
    }

    // Function to hash passwords using SHA-256
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Portfolio filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Here you would typically send the form data to a server
            // For now, we'll just log it to the console
            console.log('Form submitted:', { name, email, subject, message });

            // Reset form
            contactForm.reset();

            // Show success message (you can replace this with a more elegant solution)
            alert('Thank you for your message! I will get back to you soon.');
        });
    }
});