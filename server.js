import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' })); // Allow all origins (can be restricted in production)
app.use(express.json());

// Handle payment intent creation
app.post('/create-payment-intent', (req, res) => {
    try {
        console.log('Received payment request:', req.body);
        
        // Simulate a response from PayMongo (replace with actual API call)
        const checkoutUrl = 'https://pm.link/org-yG3h9suZNk71t45s4dXtcCDh/test/xvzLCjt';
        
        res.status(200).json({ checkout_url: checkoutUrl });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = 3000;
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
