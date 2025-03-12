// Don't import using modules for Alpine.js compatibility
// Import only what you need from Firebase
import { db, collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "./firebase-config.js";

// Define adminPanel for Alpine.js
window.adminPanel = () => {
    return {
        orders: [],
        history: [],
        pendingOrders: [],
        productionOrders: [],
        paymentOrders: [],
        deliveredOrders: [],
        
        async fetchOrders() {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                this.orders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("Orders fetched:", this.orders);
                
                // Categorize orders by status
                this.categorizeOrders();
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        },
        
        categorizeOrders() {
            // Reset arrays
            this.pendingOrders = [];
            this.productionOrders = [];
            this.paymentOrders = [];
            this.deliveredOrders = [];
            
            // Categorize orders based on their status
            this.orders.forEach(order => {
                if (order.status === "pending") {
                    this.pendingOrders.push(order);
                } else if (order.status === "production") {
                    this.productionOrders.push(order);
                } else if (order.status === "payment") {
                    this.paymentOrders.push(order);
                } else if (order.status === "delivered") {
                    this.deliveredOrders.push(order);
                }
            });
        },
        
        async deleteOrder(order) {
            if (!confirm("Are you sure you want to delete this order?")) return;
            
            try {
                // Add deletion timestamp
                const orderWithTimestamp = {
                    ...order,
                    deletedOn: new Date().toLocaleString()
                };
                
                // Move order to history before deleting
                await addDoc(collection(db, "history"), orderWithTimestamp);
                
                // Delete order from Firestore
                await deleteDoc(doc(db, "orders", order.id));
                
                // Refresh order list
                await this.fetchOrders();
                
                // Also refresh the history
                await this.fetchHistory();
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        },
        
        async updateOrderStatus(order, status) {
            try {
                // Update order status in Firestore
                await updateDoc(doc(db, "orders", order.id), {
                    status: status
                });
                
                // Refresh order list
                await this.fetchOrders();
            } catch (error) {
                console.error(`Error updating order to ${status}:`, error);
            }
        },
        
        async pendingOrder(order) {
            await this.updateOrderStatus(order, "pending");
        },
        
        async productionOrder(order) {
            await this.updateOrderStatus(order, "production");
        },
        
        async paymentOrder(order) {
            await this.updateOrderStatus(order, "payment");
        },
        
        async deliverOrder(order) {
            await this.updateOrderStatus(order, "delivered");
        },
        
        async cancelOrder(order) {
            if (!confirm("Are you sure you want to cancel this order?")) return;
            
            try {
                // Add cancellation timestamp
                const orderWithTimestamp = {
                    ...order,
                    status: "cancelled",
                    cancelledOn: new Date().toLocaleString()
                };
                
                // Move order to history before cancelling
                await addDoc(collection(db, "history"), orderWithTimestamp);
                
                // Delete order from orders collection
                await deleteDoc(doc(db, "orders", order.id));
                
                // Refresh order list
                await this.fetchOrders();
                
                // Also refresh the history
                await this.fetchHistory();
            } catch (error) {
                console.error("Error cancelling order:", error);
            }
        },
        
        async fetchHistory() {
            try {
                const querySnapshot = await getDocs(collection(db, "history"));
                this.history = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("History fetched:", this.history);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        },
        
        init() {
            console.log("Initializing adminPanel");
            this.fetchOrders();
            this.fetchHistory();
        }
    };
};