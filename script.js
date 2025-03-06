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
            this.$nextTick(() => this.setMinDate()); 
            document.documentElement.style.overflow = 'hidden';
        },

        calculateTotal() {
            this.totalPrice = this.orderQuantity * this.itemPrice;
        },

        generateOrderNumber() {
            return 'CRO' + Math.floor(100000 + Math.random() * 900000); 
        },

        closeModal() {
            this.isOpen = false;
            this.resetForm();
            document.documentElement.style.overflow = '';
        },

        setMinDate() {
            const today = new Date();
            today.setDate(today.getDate() + 7); 
            const minDate = today.toISOString().split('T')[0];

            this.deliveryDate = minDate;

            const dateInput = document.querySelector('input[type="date"]');
            if (dateInput) {
                dateInput.setAttribute('min', minDate);
            }
        },

        validateDate() {
            const minDate = new Date();
            minDate.setDate(minDate.getDate() + 7);
            const selectedDate = new Date(this.deliveryDate);

            if (selectedDate < minDate) {
                alert("Please select a valid delivery date.");
                this.deliveryDate = minDate.toISOString().split('T')[0];
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


