// Payment Configuration
const PAYMENT_CONFIG = {
    stripe: {
        publicKey: 'pk_test_your_key_here',
        currency: 'USD'
    },
    paypal: {
        clientId: 'your_client_id_here',
        environment: 'sandbox' // Change to 'production' for live
    }
};

class PaymentManager {
    constructor() {
        this.stripe = null;
        this.paypal = null;
        this.init();
    }

    async init() {
        // Load Stripe.js
        if (document.querySelector('#stripe-script') || !PAYMENT_CONFIG.stripe.publicKey.includes('test')) {
            await this.loadStripe();
        }

        // Load PayPal
        if (document.querySelector('#paypal-script')) {
            await this.loadPayPal();
        }

        this.setupEventListeners();
    }

    async loadStripe() {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.id = 'stripe-script';
        document.head.appendChild(script);

        return new Promise((resolve) => {
            script.onload = () => {
                this.stripe = Stripe(PAYMENT_CONFIG.stripe.publicKey);
                resolve();
            };
        });
    }

    async loadPayPal() {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.paypal.clientId}&currency=USD`;
        script.id = 'paypal-script';
        document.head.appendChild(script);
    }

    setupEventListeners() {
        // Card payment form
        const cardForm = document.getElementById('cardForm');
        if (cardForm) {
            cardForm.addEventListener('submit', (e) => this.handleCardPayment(e));
        }

        // Mobile money payment
        const mobileForm = document.getElementById('mobileForm');
        if (mobileForm) {
            mobileForm.addEventListener('submit', (e) => this.handleMobilePayment(e));
        }
    }

    async handleCardPayment(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        try {
            // Create payment method
            const { paymentMethod, error } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement('cardNumber'),
                billing_details: {
                    name: form.querySelector('#cardName').value,
                    email: form.querySelector('#cardEmail').value
                }
            });

            if (error) throw error;

            // Process payment
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    amount: this.getTotalAmount(),
                    currency: PAYMENT_CONFIG.stripe.currency,
                    courseId: this.getSelectedCourse()
                })
            });

            const result = await response.json();

            if (result.success) {
                window.MathEconApp.showNotification('Payment successful!');
                this.completePurchase(result.orderId);
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            window.MathEconApp.showNotification(`Payment failed: ${error.message}`, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Complete Payment';
        }
    }

    async handleMobilePayment(event) {
        event.preventDefault();
        
        const form = event.target;
        const provider = form.querySelector('select[name="mobileProvider"]').value;
        const phone = form.querySelector('input[name="mobilePhone"]').value;
        const amount = this.getTotalAmount();
        
        // Simulate mobile payment
        const paymentCode = this.generateMobilePaymentCode(provider, amount);
        
        // Show payment instructions
        this.showMobileInstructions(provider, phone, amount, paymentCode);
        
        // Poll for payment confirmation
        this.pollMobilePayment(paymentCode);
    }

    generateMobilePaymentCode(provider, amount) {
        return `${provider.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    showMobileInstructions(provider, phone, amount, code) {
        const instructions = {
            airtel: `Dial *126*1*1*${phone}*${amount}*${code}#`,
            mtn: `Dial *165*1*1*${phone}*${amount}*${code}#`,
            zamtel: `Dial *111*1*1*${phone}*${amount}*${code}#`
        };

        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Complete Mobile Payment</h3>
                <p>To complete your payment of $${amount}:</p>
                <div class="instruction-box">
                    <code>${instructions[provider]}</code>
                </div>
                <p>Or send money to: <strong>${phone}</strong> with reference: <strong>${code}</strong></p>
                <div class="payment-status">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Waiting for payment confirmation...</span>
                </div>
                <button class="btn btn-outline" onclick="this.closest('.payment-modal').remove()">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    async pollMobilePayment(paymentCode) {
        // Simulate checking payment status
        for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In production, check with your payment processor
            const isPaid = Math.random() > 0.7; // Simulate 70% chance of payment
            
            if (isPaid) {
                document.querySelector('.payment-status').innerHTML = `
                    <i class="fas fa-check-circle text-success"></i>
                    <span>Payment confirmed! Redirecting...</span>
                `;
                
                setTimeout(() => {
                    this.completePurchase(`MOBILE-${paymentCode}`);
                }, 2000);
                break;
            }
        }
    }

    getTotalAmount() {
        const totalElement = document.querySelector('.summary-total span:last-child');
        if (totalElement) {
            return parseFloat(totalElement.textContent.replace('$', ''));
        }
        return 97; // Default amount
    }

    getSelectedCourse() {
        const selectedCourse = document.querySelector('input[name="course"]:checked');
        return selectedCourse ? selectedCourse.value : 'bundle';
    }

    completePurchase(orderId) {
        // Save purchase to localStorage
        const purchase = {
            orderId,
            course: this.getSelectedCourse(),
            date: new Date().toISOString(),
            amount: this.getTotalAmount()
        };

        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        // Redirect to success page
        setTimeout(() => {
            window.location.href = `payment-success.html?order=${orderId}`;
        }, 1000);
    }
}

// Initialize payment manager
const paymentManager = new PaymentManager();