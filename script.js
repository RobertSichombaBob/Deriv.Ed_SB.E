// Core Application
class MathEconApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.progress = {};
        this.init();
    }

    init() {
        this.loadUser();
        this.setupEventListeners();
        this.updateCartCount();
        this.setupServiceWorker();
    }

    setupEventListeners() {
        // Mobile menu
        document.querySelectorAll('.menu-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                document.querySelectorAll('.nav-menu').forEach(menu => {
                    menu.classList.toggle('active');
                });
            });
        });

        // Week tabs
        document.querySelectorAll('.week-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const week = tab.dataset.week;
                this.showWeekContent(week);
            });
        });

        // Filter courses
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterCourses(filter);
            });
        });

        // Enrollment steps
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.nextStep(e.target.closest('.form-step'));
            });
        });

        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.prevStep(e.target.closest('.form-step'));
            });
        });

        // Payment method toggle
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePaymentDetails(e.target.value);
            });
        });
    }

    loadUser() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.updateLoginUI();
        }
    }

    updateLoginUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.currentUser) {
            loginBtn.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${this.currentUser.name}</span>
            `;
            loginBtn.href = 'dashboard.html';
        }
    }

    showWeekContent(week) {
        // Update active tab
        document.querySelectorAll('.week-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.week === week) {
                tab.classList.add('active');
            }
        });

        // Show content
        document.querySelectorAll('.week-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `week${week}-content`) {
                content.classList.add('active');
            }
        });
    }

    filterCourses(filter) {
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        // Filter courses
        document.querySelectorAll('.course-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    nextStep(currentStep) {
        const nextStep = currentStep.nextElementSibling;
        if (nextStep && nextStep.classList.contains('form-step')) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            this.updateStepProgress(nextStep);
        }
    }

    prevStep(currentStep) {
        const prevStep = currentStep.previousElementSibling;
        if (prevStep && prevStep.classList.contains('form-step')) {
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            this.updateStepProgress(prevStep);
        }
    }

    updateStepProgress(step) {
        const steps = document.querySelectorAll('.step');
        steps.forEach((s, index) => {
            if (Array.from(steps).indexOf(step.parentNode) >= index) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    togglePaymentDetails(method) {
        const cardDetails = document.getElementById('cardDetails');
        if (method === 'card') {
            cardDetails.style.display = 'block';
        } else {
            cardDetails.style.display = 'none';
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    addToCart(course) {
        this.cart.push(course);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.showNotification('Course added to cart!');
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    }

    // Payment handling
    async processPayment(paymentData) {
        // For demo purposes - in production, integrate with Stripe/PayPal
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate order ID
            const orderId = 'ORD' + Date.now();
            
            // Save order
            const order = {
                id: orderId,
                ...paymentData,
                date: new Date().toISOString(),
                status: 'completed'
            };
            
            localStorage.setItem(`order_${orderId}`, JSON.stringify(order));
            
            // Redirect to success page
            window.location.href = `payment-success.html?order=${orderId}`;
            
        } catch (error) {
            this.showNotification('Payment failed. Please try again.', 'error');
        }
    }
}

// Initialize app
const app = new MathEconApp();

// Export for use in other modules
window.MathEconApp = app;