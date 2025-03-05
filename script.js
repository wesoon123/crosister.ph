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

         
            const dateInput = document.querySelector('input[type="date"]');
            if (dateInput) {
                dateInput.setAttribute('min', minDate);
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
            emailjs.send("service_7co8bcr", "template_Crosister", templateParams, "j17XET_AvuYGpKwjj")
                .then(response => {
                    console.log("Email sent successfully to seller!", response);
                })
                .catch(error => {
                    console.error("EmailJS Error (Seller):", error);
                });

            // Send email confirmation to the customer
            emailjs.send("service_7co8bcr", "template_8gnl2s8", templateParams, "j17XET_AvuYGpKwjj")
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


/*-------------customizer-------------------*/

function customizer() {
    return {
        items: [
            { name: 'Swimwear', colors: ['#fcec03', '#0366fc', '#03fc0b', '#fc5a03'], sizes: ['S', 'M', 'L'], patterns: ['None', 'Striped', 'Plain', 'Crochet'] },
            { name: 'Bonnet', colors: ['Black', 'White'], sizes: ['One Size'], patterns: ['Knitted', 'Plain'] },
            { name: 'Key Chain', colors: ['Gold', 'Silver'], sizes: ['Small', 'Medium'], patterns: ['Engraved', 'Plain'] },
            { name: 'Polo', colors: ['White', 'Blue'], sizes: ['M', 'L', 'XL'], patterns: ['Striped', 'Solid'] },
            { name: 'Flowers', colors: ['Pink', 'Yellow'], sizes: ['Small', 'Large'], patterns: ['Rose', 'Tulip'] },
            { name: 'Toy Figure', colors: ['Gray', 'Brown'], sizes: ['Mini', 'Standard'], patterns: ['Anime', 'Realistic'] },
            { name: 'Baby Costume', colors: ['Gray', 'Brown'], sizes: ['Mini', 'Standard'], patterns: ['Anime', 'Realistic'] }
        ],
        selectedItem: null,
        selectedColor: null,
        selectedSize: null,
        selectedPattern: null,
        quantity: 1,
        contactName: '',
        contactAddress: '',
        contactNumber: '',
        contactEmail: '',
        cusdeliveryDate: '',
        minDeliveryDate: '', 
        submittedData: [],

        openCustomizer(item) {
            if (!item) return;
            this.selectedItem = item;
            this.selectedColor = item.colors[0] || null;
            this.selectedSize = item.sizes[0] || null;
            this.selectedPattern = item.patterns[0] || null;
            this.quantity = 1;
            this.contactNumber = '';
            this.email = '';
            this.generateOrderNumber();
            this.setMinDeliveryDate();
        },

        generateOrderNumber() {
            this.cusNumber = 'CUS' + Math.floor(100000 + Math.random() * 900000);
        },

        setMinDeliveryDate() {
            const today = new Date();
            today.setDate(today.getDate() + 7); // Minimum date is 1 week ahead
            this.minDeliveryDate = today.toISOString().split('T')[0];
            this.cusdeliveryDate = this.minDeliveryDate; // Default to min date
        },

        submitCustomization() {
            if (!this.selectedItem || !this.contactNumber || !this.cusdeliveryDate) {
                alert('Please complete the customization form.');
                return;
            }

            const order = {
                cusNumber: this.cusNumber,
                item: this.selectedItem.name,
                color: this.selectedColor,
                size: this.selectedSize,
                pattern: this.selectedPattern,
                quantity: this.quantity,
                contactName: this.contactName,
                contactAddress:this.contactAddress,
                contactNumber: this.contactNumber,
                contactEmail: this.contactEmail,
                cusdeliveryDate: this.cusdeliveryDate
            };

            this.submittedData.push(order);
            console.log('Submitted Order:', order);

            alert('Your customization has been submitted!');

            this.resetForm();
        },

        sendEmailNotification(order) {
            const customizeParams = {
                cusNumber: order.cusNumber,
                item: order.item,
                color: order.color,
                size: order.size,
                pattern: order.pattern,
                quantity: order.quantity,
                contactAddress: order.contactAddress,
                contactNumber: order.contactNumber,
                email: order.email,
                cusdeliveryDate: order.cusdeliveryDate
            };

            emailjs.send("service_7co8bcr", "template_Crosister", customizeParams, "j17XET_AvuYGpKwjj")
                .then(response => {
                    console.log("Email sent successfully!", response);
                })
                .catch(error => {
                    console.error("Error sending email:", error);
                });
        },

        resetForm() {
            this.selectedItem = null;
            this.selectedColor = null;
            this.selectedSize = null;
            this.selectedPattern = null;
            this.quantity = 1;
            this.contactAddress = '';
            this.contactNumber = '';
            this.email = '';
            this.cusdeliveryDate = '';
            this.cusNumber = '';
        }
    };
}

