# Kasuwa-Dan-Goronyo-pro-

# 🏪 Kasuwa Dan Goronyo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green)](https://www.mongodb.com/)

> **Tsarin Kasuwanci na Zamani** - Gudanar da kasuwancin ku ta hanyar fasaha mai sauki da amfani.

![Kasuwa Dan Goronyo Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=Kasuwa+Dan+Goronyo+-+Market+Management+System)

---

## 📋 Abubuwan da Ake Ƙunsa

- 🔐 **Tsaro Mai Karfi** - JWT authentication da role-based access
- 📦 **Gudanar da Kayayyaki** - Stock tracking da low-stock alerts
- 🛒 **Sayayya** - POS system da multiple payment methods
- 👥 **Abokan Ciniki** - Customer management da credit tracking
- 📊 **Rahotanni** - Sales reports da analytics
- 🏷️ **Rukunoni** - Category management
- 📱 **Responsive** - Yana aiki a waya da kwamfuta

---

## 🚀 Fara Amfani

### Bukatun Farko

- [Node.js](https://nodejs.org/) v14 ko sama
- [MongoDB](https://www.mongodb.com/) v4.4 ko sama
- [Git](https://git-scm.com/)

### Shigarwa

```bash
# 1. Clone repository
git clone https://github.com/arewadigitalhuhb-eng/Kasuwa-Dan-Goronyo-pro-.git

# 2. Shiga cikin directory
cd Kasuwa-Dan-Goronyo-pro-

# 3. Shigar da dependencies
npm install

# 4. Gina .env fayil
cp .env.example .env

# 5. Sanya bayananka a cikin .env
nano .env


Saita Environment Variables

# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kasuwa_db
# Ko MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/kasuwa_db

# JWT
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

Gudanar da Application
bash
Server zai tashi a  http://localhost:5000

📁 Tsarin Fayiloli
kasuwa-backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product management
│   ├── saleController.js    # Sales & POS
│   ├── categoryController.js # Categories
│   └── customerController.js # Customers
├── middleware/
│   ├── auth.js              # JWT & role protection
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Sale.js              # Sale model
│   ├── Category.js          # Category model
│   └── Customer.js          # Customer model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── products.js          # Product routes
│   ├── sales.js             # Sales routes
│   ├── categories.js        # Category routes
│   └── customers.js         # Customer routes
├── utils/
│   └── helpers.js           # Utility functions
├── .env                     # Environment variables
├── .env.example             # Example env file
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Entry point
└── README.md                # This file


🔌 API Endpoints
🔐 Authentication
Table
Method
Endpoint
Description
Access
POST
 /api/auth/register 
Register new user
Admin/Manager
POST
 /api/auth/login 
Login user
Public
GET
 /api/auth/me 
Get current user
Private
PUT
 /api/auth/profile 
Update profile
Private
PUT
 /api/auth/password 
Change password
Private
📦 Products
Table
Method
Endpoint
Description
Access
GET
 /api/products 
Get all products
Private
GET
 /api/products/:id 
Get single product
Private
POST
 /api/products 
Create product
Admin/Manager
PUT
 /api/products/:id 
Update product
Admin/Manager
DELETE
 /api/products/:id 
Delete product
Admin
POST
 /api/products/:id/stock 
Add stock
Admin/Manager
🛒 Sales
Table
Method
Endpoint
Description
Access
GET
 /api/sales 
Get all sales
Private
GET
 /api/sales/report 
Get sales report
Admin/Manager
GET
 /api/sales/:id 
Get single sale
Private
POST
 /api/sales 
Create sale
Private
POST
 /api/sales/:id/payment 
Make payment
Private
🏷️ Categories
Table
Method
Endpoint
Description
Access
GET
 /api/categories 
Get all categories
Private
GET
 /api/categories/:id 
Get single category
Private
POST
 /api/categories 
Create category
Admin/Manager
PUT
 /api/categories/:id 
Update category
Admin/Manager
DELETE
 /api/categories/:id 
Delete category
Admin
👥 Customers
Table
Method
Endpoint
Description
Access
GET
 /api/customers 
Get all customers
Private
GET
 /api/customers/:id 
Get single customer
Private
GET
 /api/customers/:id/sales 
Get customer sales
Private
POST
 /api/customers 
Create customer
Private
PUT
 /api/customers/:id 
Update customer
Private
DELETE
 /api/customers/:id 
Delete customer
Admin/Manager
🛡️ Matsayoyin Amfani (Roles)
Table
Role
Yancin Amfani
Admin
Dukkan yanci (Create, Read, Update, Delete)
Manager
Yawancin yanci (Bai da yancin share masu amfani ba)
Seller
Sayarwa da kallon bayanai
Cashier
Sayayya da biyan kudi

2. Ƙirar Sabon Kaya
bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Shinkafa",
    "category": "64abc123...",
    "price": 1500,
    "quantity": 100,
    "minQuantity": 20,
    "unit": "kg"
  }'

3. Yin Sayayya
bash
curl -X POST http://localhost:5000/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "productId": "64abc123...",
        "quantity": 2,
        "price": 1500
      }
    ],
    "paymentMethod": "cash",
    "amountPaid": 3000
  }'

🧪 Gwaji (Testing)
bash

# Gudanar da dukkan gwaji
npm test

# Gudanar da gwaji tare da coverage
npm run test:coverage

🚀 Deployment
Deploy zuwa Render.com
1. 
Create account a Render
2. 
Create new Web Service
3. 
Connect da GitHub repository ɗinka
4. 
Sanya Environment Variables:
 
 MONGODB_URI  (use MongoDB Atlas)
 
 JWT_SECRET 
 
 NODE_ENV=production 
5. 
Deploy!
Deploy zuwa Railway
bash

# Shigar da Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

🛠️ Kayayyakin Da Aka Yi Amfani Da Su
Table
Kayan Aiki
Manufa
Express.js
Web framework
Mongoose
MongoDB ODM
JWT
Authentication
Bcryptjs
Password hashing
Express Validator
Input validation
Helmet
Security headers
CORS
Cross-origin requests
Morgan
HTTP logger
🤝 Taimakawa (Contributing)
Muna maraba da taimakawa! Ka bi waɗannan matakan:
1. 
Fork repository ɗin
2. 
Create branch ɗinka:  git checkout -b feature/sabon-fasaha 
3. 
Commit canje-canjenka:  git commit -m 'Ƙara sabon fasaha' 
4. 
Push zuwa branch:  git push origin feature/sabon-fasaha 
5. 
Buɗe Pull Request
Ka karanta CONTRIBUTING.md don ƙarin bayani.
📄 Lasisi
Wannan project yana ƙarƙashin MIT License.
👨‍💻 Mai Ƙirƙira
Arewa Digital Hub Engineering
 
Website: arewadigitalhub.com
 
GitHub: @arewadigitalhuhb-eng
 
Email: contact@arewadigitalhub.com
🙏 Godiya
 
Allah SWT
 
Express.js Team
 
MongoDB Team
 
Dukkan masu taimakawa
<div align="center">
⭐ Bisa da sani idan wannan project yana taimakawa! ⭐
Report Bug • Request Feature
</div>
```
Ƙarin Fayiloli Masu Amfani
Idan kana buƙatar in ƙara waɗannan fayilolin ma:
 .env.example 
env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kasuwa_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000

 .gitignore 

 node_modules/
.env
.env.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.log
coverage/
.nyc_output/
dist/
build/

 LICENSE  (MIT)
 MIT License

Copyright (c) 2024 Arewa Digital Hub Engineering

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
