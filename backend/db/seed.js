const pool = require('./connection');
require('dotenv').config();

const categories = [
  { name: 'Electronics', description: 'Phones, laptops, accessories' },
  { name: 'Fashion', description: 'Clothing, footwear, accessories' },
  { name: 'Home & Kitchen', description: 'Furniture, appliances, decor' },
  { name: 'Books', description: 'Fiction, non-fiction, textbooks' },
  { name: 'Sports', description: 'Fitness, outdoor, sports gear' },
  { name: 'Beauty', description: 'Skincare, makeup, haircare' },
];

const products = [
  { name: 'Wireless Earbuds Pro', category: 'Electronics', price: 2499, stock: 150, rating: 4.5 },
  { name: 'Smart Watch Series X', category: 'Electronics', price: 8999, stock: 80, rating: 4.3 },
  { name: 'Laptop Stand Aluminum', category: 'Electronics', price: 1299, stock: 200, rating: 4.7 },
  { name: 'USB-C Hub 7-in-1', category: 'Electronics', price: 1799, stock: 120, rating: 4.4 },
  { name: 'Mechanical Keyboard', category: 'Electronics', price: 4999, stock: 60, rating: 4.6 },
  { name: 'Cotton Kurta Set', category: 'Fashion', price: 899, stock: 300, rating: 4.2 },
  { name: 'Running Sneakers', category: 'Fashion', price: 2999, stock: 180, rating: 4.1 },
  { name: 'Slim Fit Jeans', category: 'Fashion', price: 1499, stock: 250, rating: 4.0 },
  { name: 'Formal Shirt Pack', category: 'Fashion', price: 1299, stock: 220, rating: 4.3 },
  { name: 'Tote Bag Canvas', category: 'Fashion', price: 699, stock: 400, rating: 4.5 },
  { name: 'Air Fryer 4L', category: 'Home & Kitchen', price: 3999, stock: 90, rating: 4.6 },
  { name: 'Stainless Steel Cookware Set', category: 'Home & Kitchen', price: 2799, stock: 70, rating: 4.4 },
  { name: 'LED Desk Lamp', category: 'Home & Kitchen', price: 899, stock: 160, rating: 4.3 },
  { name: 'Bamboo Cutting Board', category: 'Home & Kitchen', price: 499, stock: 300, rating: 4.2 },
  { name: 'Coffee Maker Drip', category: 'Home & Kitchen', price: 2299, stock: 50, rating: 4.5 },
  { name: 'Atomic Habits', category: 'Books', price: 399, stock: 500, rating: 4.8 },
  { name: 'Clean Code', category: 'Books', price: 699, stock: 200, rating: 4.7 },
  { name: 'The Alchemist', category: 'Books', price: 299, stock: 600, rating: 4.6 },
  { name: 'DBMS by Navathe', category: 'Books', price: 849, stock: 150, rating: 4.3 },
  { name: 'Zero to One', category: 'Books', price: 449, stock: 350, rating: 4.5 },
  { name: 'Yoga Mat Premium', category: 'Sports', price: 1299, stock: 200, rating: 4.4 },
  { name: 'Resistance Bands Set', category: 'Sports', price: 699, stock: 280, rating: 4.3 },
  { name: 'Protein Shaker 700ml', category: 'Sports', price: 499, stock: 350, rating: 4.2 },
  { name: 'Badminton Racket', category: 'Sports', price: 1799, stock: 100, rating: 4.4 },
  { name: 'Moisturizer SPF 50', category: 'Beauty', price: 599, stock: 400, rating: 4.3 },
  { name: 'Hair Serum Argan', category: 'Beauty', price: 799, stock: 250, rating: 4.5 },
  { name: 'Vitamin C Face Wash', category: 'Beauty', price: 349, stock: 500, rating: 4.2 },
];

const customers = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', city: 'Mumbai', is_premium: true },
  { name: 'Priya Reddy', email: 'priya.reddy@gmail.com', city: 'Hyderabad', is_premium: true },
  { name: 'Rohan Gupta', email: 'rohan.gupta@yahoo.com', city: 'Delhi', is_premium: false },
  { name: 'Ananya Patel', email: 'ananya.patel@gmail.com', city: 'Ahmedabad', is_premium: true },
  { name: 'Karan Singh', email: 'karan.singh@outlook.com', city: 'Chandigarh', is_premium: false },
  { name: 'Sneha Nair', email: 'sneha.nair@gmail.com', city: 'Kochi', is_premium: true },
  { name: 'Vikram Iyer', email: 'vikram.iyer@gmail.com', city: 'Chennai', is_premium: false },
  { name: 'Pooja Joshi', email: 'pooja.joshi@gmail.com', city: 'Pune', is_premium: false },
  { name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', city: 'Bangalore', is_premium: true },
  { name: 'Kavya Verma', email: 'kavya.verma@gmail.com', city: 'Jaipur', is_premium: false },
  { name: 'Nikhil Das', email: 'nikhil.das@gmail.com', city: 'Kolkata', is_premium: false },
  { name: 'Divya Kumar', email: 'divya.kumar@gmail.com', city: 'Bangalore', is_premium: true },
  { name: 'Rahul Tiwari', email: 'rahul.tiwari@gmail.com', city: 'Lucknow', is_premium: false },
  { name: 'Meera Pillai', email: 'meera.pillai@gmail.com', city: 'Trivandrum', is_premium: false },
  { name: 'Siddharth Roy', email: 'sid.roy@gmail.com', city: 'Kolkata', is_premium: true },
  { name: 'Nisha Agarwal', email: 'nisha.ag@gmail.com', city: 'Agra', is_premium: false },
  { name: 'Dev Chopra', email: 'dev.chopra@gmail.com', city: 'Delhi', is_premium: true },
  { name: 'Ritika Saxena', email: 'ritika.s@gmail.com', city: 'Noida', is_premium: false },
  { name: 'Aditya Bose', email: 'aditya.bose@gmail.com', city: 'Mumbai', is_premium: true },
  { name: 'Tanvi Shah', email: 'tanvi.shah@gmail.com', city: 'Surat', is_premium: false },
];

const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'processing', 'pending', 'cancelled'];
const paymentMethods = ['upi', 'upi', 'card', 'card', 'netbanking', 'cod'];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - randomBetween(0, daysBack));
  date.setHours(randomBetween(8, 22), randomBetween(0, 59));
  return date.toISOString();
}

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await client.query('TRUNCATE order_items, orders, products, customers, categories RESTART IDENTITY CASCADE');

    // Seed categories
    const catIds = {};
    for (const cat of categories) {
      const res = await client.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
        [cat.name, cat.description]
      );
      catIds[cat.name] = res.rows[0].id;
    }
    console.log('✅ Categories seeded');

    // Seed products
    const productIds = [];
    const productPrices = {};
    for (const p of products) {
      const res = await client.query(
        'INSERT INTO products (name, category_id, price, stock_quantity, rating) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [p.name, catIds[p.category], p.price, p.stock, p.rating]
      );
      productIds.push(res.rows[0].id);
      productPrices[res.rows[0].id] = p.price;
    }
    console.log('✅ Products seeded');

    // Seed customers
    const customerIds = [];
    for (const c of customers) {
      const joinedAt = randomDate(365);
      const res = await client.query(
        'INSERT INTO customers (name, email, city, is_premium, joined_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [c.name, c.email, c.city, c.is_premium, joinedAt]
      );
      customerIds.push(res.rows[0].id);
    }
    console.log('✅ Customers seeded');

    // Seed orders (250 orders over the last 12 months)
    for (let i = 0; i < 250; i++) {
      const customerId = customerIds[randomBetween(0, customerIds.length - 1)];
      const status = statuses[randomBetween(0, statuses.length - 1)];
      const payment = paymentMethods[randomBetween(0, paymentMethods.length - 1)];
      const createdAt = randomDate(365);

      // Random 1-4 products per order
      const itemCount = randomBetween(1, 4);
      let totalAmount = 0;
      const items = [];

      for (let j = 0; j < itemCount; j++) {
        const pid = productIds[randomBetween(0, productIds.length - 1)];
        const qty = randomBetween(1, 3);
        const unitPrice = productPrices[pid];
        totalAmount += qty * unitPrice;
        items.push({ pid, qty, unitPrice });
      }

      const orderRes = await client.query(
        'INSERT INTO orders (customer_id, total_amount, status, payment_method, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [customerId, totalAmount.toFixed(2), status, payment, createdAt]
      );
      const orderId = orderRes.rows[0].id;

      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [orderId, item.pid, item.qty, item.unitPrice]
        );
      }
    }

    console.log('✅ Orders and order items seeded (250 orders)');
    console.log('\n🎉 Database seeded successfully! ShopSphere is ready.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
