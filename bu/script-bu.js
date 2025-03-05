document.addEventListener('alpine:init', () => {
    Alpine.data('orderModal', () => ({
        isOpen: false,
        itemName: '',
        itemPrice: '',
        orderQuantity: 1,
        totalPrice: 0,
        customerName: '',
        customerNumber: '',
        address: '',
        deliveryDate: '',
        email: '',
        paymentConfirmed: false,
        notification: false,
        notificationMessage: '',
        notificationType: '',

        openModal(name, price) {
            this.itemName = name;
            this.itemPrice = price;
            this.orderQuantity = 1;
            this.calculateTotal();
            this.isOpen = true;
            this.$nextTick(() => this.setMinDate()); // Ensure Alpine updates first
            document.documentElement.style.overflow = 'hidden';
        },

        calculateTotal() {
            this.totalPrice = this.orderQuantity * this.itemPrice;
        },

        generateOrderNumber() {
            return 'CRO' + Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit order number
        },

        closeModal() {
            this.isOpen = false;
            this.resetForm();
            document.documentElement.style.overflow = '';
        },

        setMinDate() {
            const today = new Date();
            today.setDate(today.getDate() + 7); // Ensure date is at least 1 week ahead
            const minDate = today.toISOString().split('T')[0];

            this.deliveryDate = minDate; // Auto-set default min date
            const dateInput = document.querySelector('input[type="date"]');
            if (dateInput) {
                dateInput.setAttribute('min', minDate);
            }
        },

        async payWithPayMongo() {
            if (!this.email) {
                this.showNotification("Please enter an email before proceeding with payment.", "error");
                return;
            }

            try {
                let response = await fetch('http://localhost:3000/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: this.totalPrice * 100, // PayMongo expects amount in cents
                        email: this.email
                    })
                });

                if (!response.ok) {
                    throw new Error(`Payment request failed with status ${response.status}`);
                }

                let data = await response.json();
                if (data.checkout_url) {
                    window.location.href = data.checkout_url; // Redirect to PayMongo checkout
                } else {
                    throw new Error("Invalid checkout URL received.");
                }
            } catch (error) {
                console.error('Payment Error:', error);
                this.showNotification("Payment failed. Please try again.", "error");
            }
        },

        submitOrder() {
            if (!this.paymentConfirmed) {
                this.showNotification("Please confirm payment before submitting.", "error");
                return;
            }

            const orderNumber = this.generateOrderNumber();
            const templateParams = {
                orderNumber: orderNumber,
                customerName: this.customerName,
                customerNumber: this.customerNumber,
                address: this.address,
                deliveryDate: this.deliveryDate,
                email: this.email,
                itemName: this.itemName,
                itemPrice: this.itemPrice,
                orderQuantity: this.orderQuantity,
                totalPrice: this.totalPrice
            };

            // Send email to the seller
            emailjs.send("service_rinr3nf", "template_Crosister", templateParams, "j17XET_AvuYGpKwjj")
                .then(response => {
                    console.log("Email sent successfully to seller!", response);
                })
                .catch(error => {
                    console.error("EmailJS Error (Seller):", error);
                });

            // Send email confirmation to the customer
            emailjs.send("service_rinr3nf", "template_8gnl2s8", templateParams, "j17XET_AvuYGpKwjj")
                .then(response => {
                    console.log("Email sent successfully to customer!", response);
                    this.showNotification("Order confirmation sent to " + this.email, "success");
                    this.closeModal();
                })
                .catch(error => {
                    console.error("EmailJS Error (Customer):", error);
                    this.showNotification("Error sending email. Please try again.", "error");
                });
        },

        showNotification(message, type) {
            this.notificationMessage = message;
            this.notificationType = type;
            this.notification = false; // 🔄 Force reactivity
            setTimeout(() => { 
                this.notification = true; 
            }, 10); // Small delay before showing
            setTimeout(() => { 
                this.notification = false; 
            }, 3000);
        },

        resetForm() {
            this.customerName = '';
            this.customerNumber = '';
            this.address = '';
            this.deliveryDate = '';
            this.email = '';
            this.paymentConfirmed = false;
            this.orderQuantity = 1;
            this.totalPrice = 0;
        }
    }));
});



if (window.location.pathname.endsWith(".html")) {
    window.history.replaceState(null, "", window.location.pathname.replace(".html", ""));
}