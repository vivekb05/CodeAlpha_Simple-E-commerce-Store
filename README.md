# Simple E-commerce Store

This is a basic, full-stack e-commerce application demonstrating product listings, a shopping cart, user authentication (registration/login), and order placement. It's built as part of a Full Stack Development internship, focusing on core web development concepts using Node.js/Express for the backend and plain HTML, CSS, JavaScript for the frontend.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [How to Run](#how-to-run)
- [Important Notes](#important-notes)
- [Possible Enhancements](#possible-enhancements)

## Features

-   **Product Listing:** Display a list of available products with details like name, description, price, and images.
-   **Product Detail Page:** View more detailed information about individual products.
-   **Shopping Cart:** Add products to a cart, adjust quantities, and remove items.
-   **User Registration:** Create new user accounts.
-   **User Login:** Authenticate existing users.
-   **Authentication:** Secure API routes using JSON Web Tokens (JWT).
-   **Order Placement:** Users can place orders for items in their cart (requires login).
-   **Static File Serving:** Serve product images directly from the backend server.

## Technologies Used

### Frontend

-   **HTML:** For structuring the web pages.
-   **CSS:** For styling and layout.
-   **JavaScript :** For interactive elements, fetching data from the backend, and managing cart logic.

### Backend

-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web application framework for Node.js, used to build RESTful APIs.
-   **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
-   **jsonwebtoken (JWT):** For implementing token-based authentication.

## Project Structure
ecommerce_store/
├── backend/
│   ├── node_modules/
│   ├── public/
│   │   ├── images/             # Stores product image files
│   │   │   ├── laptop.jpg
│   │   │   └── ...
│   │   └── frontend_app/       # Contains all frontend HTML, CSS, and JS files
│   │       ├── index.html
│   │       ├── style.css
│   │       ├── script.js
│   │       ├── login.html
│   │       ├── login.js
│   │       ├── register.html
│   │       ├── register.js
│   │       ├── product_detail.html
│   │       ├── product_detail.js
│   │       ├── cart.html
│   │       └── cart.js
│   ├── server.js               # Main backend server file
│   └── package.json            # Node.js project configuration and dependencies
├── .gitignore                  # (Optional) Specifies intentionally untracked files to ignore
└── README.md                   # This file

## Setup Instructions

### 1. Clone the Repository 

If you're getting this from a Git repository:
```bash
git clone <your-repo-url>
cd ecommerce_store

***Backend Setup
Navigate to the backend directory:
cd ecommerce_store/backend

***Install dependencies:
npm install


***How to Run
1. Start the Backend Server:

cd ecommerce_store/backend
node server.js

2.Access the Frontend Application:

Open your web browser
In the address bar, go to:
http://localhost:3000/frontend_app/index.html