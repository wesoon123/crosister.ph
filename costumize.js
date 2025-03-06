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
        toastMessage: '', // 🔹 Define toastMessage
        showToast: false, // 🔹 Flag to show toast

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
            today.setDate(today.getDate() + 7);
            this.minDeliveryDate = today.toISOString().split('T')[0];
            this.cusdeliveryDate = this.minDeliveryDate;
        },

        submitCustomization() {
            if (!this.selectedItem || !this.contactNumber || !this.cusdeliveryDate) {
                alert('Please complete the customization form.');
                return;
            }
        
            this.generateOrderNumber(); // Ensure order number is generated before saving
        
            const order = {
                cusNumber: this.cusNumber,
                item: this.selectedItem.name,
                color: this.selectedColor,
                size: this.selectedSize,
                pattern: this.selectedPattern,
                quantity: this.quantity,
                contactName: this.contactName,
                contactAddress: this.contactAddress,
                contactNumber: this.contactNumber,
                contactEmail: this.contactEmail,
                cusdeliveryDate: this.cusdeliveryDate
            };
        
            
            let orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        
            
            orders.push(order);
        
            
            localStorage.setItem('adminOrders', JSON.stringify(orders));
        
            console.log('🔹 Submitted Order:', order);
            console.log('🔹 Orders in localStorage:', JSON.parse(localStorage.getItem('adminOrders')));
        
            this.showToastNotification('Order sent to admin successfully!');
        
            this.resetForm();
        },

        showToastNotification(message) {
            this.toastMessage = message;
            this.showToast = true;
            setTimeout(() => this.showToast = false, 3000); // Hide after 3s
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
