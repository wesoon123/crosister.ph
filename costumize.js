import { db, addDoc, collection } from "./firebase-config.js";

document.addEventListener('alpine:init', () => {
    Alpine.data('customizer', () => ({
        items: [
            { 
                name: 'Swimwear', 
                colors: ['#fcec03', '#0366fc', '#03fc0b', '#fc5a03'], 
                sizes: ['S', 'M', 'L'], 
                patterns: ['None', 'Striped', 'Plain', 'Crochet'],
                basePrice: 550,
                sizePrices: { 'S': 0, 'M': 50, 'L': 100 },
                patternPrices: { 'None': 0, 'Striped': 100, 'Plain': 50, 'Crochet': 150 },
                imagePath: './img/img24.jpg',
                imagePosition: 'center center',
            },
            { 
                name: 'Bonnet', 
                colors: ['#000000', '#FFFFFF'], 
                sizes: ['One Size'], 
                patterns: ['Knitted', 'Plain'],
                basePrice: 250,
                sizePrices: { 'One Size': 0 },
                patternPrices: { 'Knitted': 50, 'Plain': 0 },
                imagePath: './img/img34.jpg',
                imagePosition: 'center center',
            },
            { 
                name: 'Key Chain', 
                colors: ['#FFD700', '#C0C0C0'], 
                sizes: ['Small', 'Medium'], 
                patterns: ['Engraved', 'Plain'],
                basePrice: 150,
                sizePrices: { 'Small': 0, 'Medium': 25 },
                patternPrices: { 'Engraved': 50, 'Plain': 0 },
                imagePath: './img/img30.jpg',
                imagePosition: 'center center',
            },
            { 
                name: 'Polo', 
                colors: ['#FFFFFF', '#0000FF'], 
                sizes: ['M', 'L', 'XL'], 
                patterns: ['Striped', 'Solid'],
                basePrice: 450,
                sizePrices: { 'M': 0, 'L': 50, 'XL': 100 },
                patternPrices: { 'Striped': 75, 'Solid': 0 },
                imagePath: './img/img35.jpg',
                imagePosition: 'center center',
            },
            { 
                name: 'Flowers', 
                colors: ['#FFC0CB', '#FFFF00'], 
                sizes: ['Small', 'Large'], 
                patterns: ['Rose', 'Tulip'],
                basePrice: 350,
                sizePrices: { 'Small': 0, 'Large': 100 },
                patternPrices: { 'Rose': 75, 'Tulip': 50 },
                imagePath: './img/img15.jpeg',
                imagePosition: 'center center',
            },
            { 
                name: 'Toy Figure', 
                colors: ['None'], 
                sizes: ['Mini', 'Standard'], 
                patterns: ['Mickey', 'Minnie', 'Donald', 'Daisy','Stitch','Pooh','Barbie','Cinderella','Snow white'],
                basePrice: 650,
                sizePrices: { 'Mini': 0, 'Standard': 150 },
                patternPrices: { 'Anime': 100, 'Realistic': 200 },
                imagePath: './img/img26.jpg',
                imagePosition: 'center center',
            },
            { 
                name: 'Baby Costume', 
                colors: ['#808080', '#A52A2A'], 
                sizes: ['Mini', 'Standard'], 
                patterns: ['Anime', 'Realistic'],
                basePrice: 850,
                sizePrices: { 'Mini': 0, 'Standard': 150 },
                patternPrices: { 'Anime': 100, 'Realistic': 200 },
                imagePath: './img/img38.jpg',
                imagePosition: 'center center',
            }
        ],
        selectedItem: null,
        selectedColor: "",
        selectedSize: "",
        selectedPattern: "",
        quantity: 1,
        contactName: "",
        contactAddress: "",
        contactNumber: "",
        contactEmail: "",
        cusdeliveryDate: "",
        cusNumber: "",
        minDeliveryDate: new Date().toISOString().split("T")[0],
        showToast: false,
        toastMessage: "",
        
        // Price calculation properties
        basePrice: 0,
        sizePrice: 0,
        patternPrice: 0,
        itemSubtotal: 0,
        totalPrice: 0,
        
        // Color name mapping
        colorNames: {
            '#fcec03': 'Yellow',
            '#0366fc': 'Blue',
            '#03fc0b': 'Green',
            '#fc5a03': 'Orange',
            '#000000': 'Black',
            '#FFFFFF': 'White',
            '#FFD700': 'Gold',
            '#C0C0C0': 'Silver',
            '#0000FF': 'Blue',
            '#FFC0CB': 'Pink',
            '#FFFF00': 'Yellow',
            '#808080': 'Gray',
            '#A52A2A': 'Brown'
        },
        
        getColorName(hexCode) {
            return this.colorNames[hexCode] || hexCode;
        },

        openCustomizer(item) {
            this.selectedItem = item;
            this.selectedColor = item.colors[0];
            this.selectedSize = item.sizes[0];
            this.selectedPattern = item.patterns[0];
            this.quantity = 1;
            
            // Initialize price calculation
            this.calculatePrice();
            
            // Update color display after selecting the item and color
            this.$nextTick(() => {
                this.updateColorDisplay();
            });
        },
        
        calculatePrice() {
            if (!this.selectedItem) return;
            
            // Get base price from selected item
            this.basePrice = this.selectedItem.basePrice || 0;
            
            // Add size price
            this.sizePrice = this.selectedItem.sizePrices[this.selectedSize] || 0;
            
            // Add pattern price
            this.patternPrice = this.selectedItem.patternPrices[this.selectedPattern] || 0;
            
            // Calculate subtotal for a single item
            this.itemSubtotal = this.basePrice + this.sizePrice + this.patternPrice;
            
            // Calculate total price based on quantity
            this.totalPrice = this.itemSubtotal * this.quantity;
        },
        
        formatNumber(num) {
            return num.toLocaleString('en-PH');
        },
        
        updateColorDisplay() {
            // This function updates the color swatch to match the selected color
            const colorDisplay = document.getElementById('colorDisplay');
            if (colorDisplay) {
                colorDisplay.style.backgroundColor = this.selectedColor;
            }
        },

        async submitCustomization() {
            if (!this.contactName || !this.contactAddress || !this.contactNumber || !this.contactEmail) {
                this.toastMessage = "Please fill in all required fields.";
                this.showToast = true;
                return;
            }

            this.cusNumber = `ORD-${Date.now()}`;

            const order = {
                cusNumber: this.cusNumber,
                item: this.selectedItem.name,
                color: this.getColorName(this.selectedColor),
                colorCode: this.selectedColor,
                size: this.selectedSize,
                pattern: this.selectedPattern,
                quantity: this.quantity,
                basePrice: this.basePrice,
                sizePrice: this.sizePrice,
                patternPrice: this.patternPrice,
                itemSubtotal: this.itemSubtotal,
                totalPrice: this.totalPrice,
                contactName: this.contactName,
                contactAddress: this.contactAddress,
                contactNumber: this.contactNumber,
                contactEmail: this.contactEmail,
                deliveryDate: this.cusdeliveryDate,
                orderDate: new Date().toISOString()
            };

            console.log("Order Submitted:", order);

            try {
                const docRef = await addDoc(collection(db, "orders"), order);
                console.log("Document written with ID: ", docRef.id);

                this.toastMessage = "Your order has been submitted!. We will send email for verification and payment";
                this.showToast = true;

                // Reset all fields after submission
                this.selectedItem = null;
                this.selectedColor = "";
                this.selectedSize = "";
                this.selectedPattern = "";
                this.quantity = 1;
                this.contactName = "";
                this.contactAddress = "";
                this.contactNumber = "";
                this.contactEmail = "";
                this.cusdeliveryDate = "";
                this.cusNumber = "";
                this.basePrice = 0;
                this.sizePrice = 0;
                this.patternPrice = 0;
                this.itemSubtotal = 0;
                this.totalPrice = 0;
            } catch (error) {
                console.error("Error adding document: ", error);
                this.toastMessage = "Error submitting order.";
                this.showToast = true;
            }
        },

        closeToast() {
            this.showToast = false;
        }
    }));
});