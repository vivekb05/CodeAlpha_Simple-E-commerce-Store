const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const app = express();
const PORT = 3000;


app.use(cors()); 
app.use(express.json()); 


app.use(express.static('public')); // <--- THIS IS THE ADDED LINE FROM PREVIOUS STEPS

let users = []; 
let products = [ 
    { id: 'prod1', name: 'Laptop', description: 'Powerful computing machine for all your needs.', price: 1200.00, imageUrl: '/images/laptop.jpg' },
    { id: 'prod2', name: 'Wireless Mouse', description: 'Ergonomic mouse with long-lasting battery.', price: 25.00, imageUrl: '/images/mouse.jpg' },
    { id: 'prod3', name: 'Mechanical Keyboard', description: 'RGB backlit keyboard with satisfying clicky keys.', price: 75.00, imageUrl: '/images/keyboard.jpg' },
    { id: 'prod4', name: '27-inch Monitor', description: 'Immersive display with stunning clarity and vibrant colors.', price: 300.00, imageUrl: '/images/monitor.jpg' },
    { id: 'prod5', name: 'HD Webcam', description: 'High-definition webcam for crystal-clear video calls.', price: 50.00, imageUrl: '/images/webcam.jpg' },
    { id: 'prod6', name: 'Gaming Headset', description: 'Immersive sound with noise-cancelling microphone.', price: 80.00, imageUrl: '/images/headset.jpg' },
    { id: 'prod7', name: 'External SSD 2TB', description: 'Blazing fast storage for all your files.', price: 150.00, imageUrl: '/images/ssd.jpg' },
    { id: 'prod8', name: 'Smartphone Tripod', description: 'Stable and adjustable tripod for mobile photography.', price: 20.00, imageUrl: '/images/tripod.jpg' },
    { id: 'prod9', name: 'USB-C Hub', description: 'Multi-port adapter for modern laptops.', price: 40.00, imageUrl: '/images/usbchub.jpg' },
    { id: 'prod10', name: 'Portable Power Bank', description: 'Keep your devices charged on the go, 20000mAh.', price: 35.00, imageUrl: '/images/powerbank.jpg' }

];
let orders = []; 

const JWT_SECRET = 'your_super_secret_jwt_key_please_change_this_in_production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401).send('Access Token Required');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403).send('Invalid or Expired Token');
        }
        req.user = user;
        next();
    });
};

app.get('/', (req, res) => {
    res.send('E-commerce Backend API is running!');
});

// 1. User Registration
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }
    if (users.find(u => u.username === username)) {
        return res.status(409).send('Username already exists. Please choose a different one.');
    }
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    console.log(`New user registered: ${username}`);
    res.status(201).send('User registered successfully!');
});

// 2. User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const accessToken = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(`User logged in: ${username}`);
        res.json({ token: accessToken, username: user.username, userId: user.id });
    } else {
        res.status(401).send('Invalid username or password.');
    }
});

// 3. Get All Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 4. Get Product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found.');
    }
});

// 5. Add a New Product (Requires Authentication)
app.post('/api/products', authenticateToken, (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    if (!name || !description || !price || !imageUrl) {
        return res.status(400).send('Product name, description, price, and imageUrl are required.');
    }
    if (isNaN(parseFloat(price))) {
        return res.status(400).send('Price must be a valid number.');
    }

    const newProduct = {
        id: `prod${products.length + 1}`,
        name,
        description,
        price: parseFloat(price),
        imageUrl
    };
    products.push(newProduct);

    console.log(`New product added by ${req.user.username}: ${newProduct.name}`);
    res.status(201).json(newProduct);
});

// 6. Place an Order (Requires Authentication)
app.post('/api/orders', authenticateToken, (req, res) => {
    const { cartItems, total } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).send('Cart items are required to place an order.');
    }
    if (isNaN(parseFloat(total))) {
        return res.status(400).send('Order total must be a valid number.');
    }
    const newOrder = {
        orderId: `order_${orders.length + 1}`,
        userId: req.user.id,
        username: req.user.username,
        items: cartItems,
        total: parseFloat(total),
        orderDate: new Date().toISOString()
    };
    orders.push(newOrder);
    console.log(`Order placed by ${req.user.username}. Total: $${newOrder.total}`);
    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder.orderId });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});