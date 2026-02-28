const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [
  {
    name: 'Apple iPhone 14 Pro Max',
    price: 999.00,
    originalPrice: 1099.00,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500'
    ],
    description: 'The iPhone 14 Pro Max features a stunning 6.7-inch Super Retina XDR display with ProMotion technology. Powered by the A16 Bionic chip, it delivers exceptional performance. The 48MP main camera captures incredible detail.',
    category: 'Mobile Phones',
    stock: 50,
    rating: 4.8,
    reviewCount: 2456,
    brand: 'Apple',
    features: ['6.7" Super Retina XDR Display', 'A16 Bionic Chip', '48MP Camera System', '5G Capable'],
    isFeatured: true
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    price: 1199.00,
    originalPrice: 1299.00,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'
    ],
    description: 'Samsung Galaxy S23 Ultra with built-in S Pen, 200MP camera, and Snapdragon 8 Gen 2 processor. Features a stunning 6.8-inch Dynamic AMOLED display with 120Hz refresh rate.',
    category: 'Mobile Phones',
    stock: 35,
    rating: 4.7,
    reviewCount: 1890,
    brand: 'Samsung',
    features: ['200MP Camera', 'S Pen Built-in', 'Snapdragon 8 Gen 2', '5000mAh Battery'],
    isFeatured: true
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    price: 2499.00,
    originalPrice: 2799.00,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'
    ],
    description: 'The MacBook Pro 16-inch with M3 Max chip delivers unprecedented performance. Up to 128GB unified memory and up to 8TB SSD storage. Perfect for professionals who demand the best.',
    category: 'Laptops',
    stock: 20,
    rating: 4.9,
    reviewCount: 876,
    brand: 'Apple',
    features: ['M3 Max Chip', '16" Liquid Retina XDR Display', 'Up to 22-hour Battery', 'MagSafe Charging'],
    isFeatured: true
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    price: 348.00,
    originalPrice: 399.00,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'
    ],
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30-hour battery life with quick charging.',
    category: 'Headphones',
    stock: 100,
    rating: 4.6,
    reviewCount: 3421,
    brand: 'Sony',
    features: ['Industry-leading Noise Cancellation', '30-hour Battery', 'Multipoint Connection', 'Speak-to-Chat'],
    isFeatured: true
  },
  {
    name: 'Apple Watch Series 9',
    price: 399.00,
    originalPrice: 449.00,
    image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500',
    images: [
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500'
    ],
    description: 'Apple Watch Series 9 with the powerful S9 SiP chip. Features Double Tap gesture, brighter display, and advanced health monitoring including blood oxygen and ECG.',
    category: 'Watches',
    stock: 75,
    rating: 4.5,
    reviewCount: 1234,
    brand: 'Apple',
    features: ['S9 SiP Chip', 'Double Tap Gesture', 'Blood Oxygen Sensor', 'Always-On Retina Display'],
    isFeatured: true
  },
  {
    name: 'Canon EOS R6 Mark II',
    price: 2499.00,
    originalPrice: 2699.00,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500'
    ],
    description: 'Full-frame mirrorless camera with 24.2MP sensor. Up to 40fps continuous shooting and 6K RAW video. Advanced subject detection AF for people, animals, and vehicles.',
    category: 'Cameras',
    stock: 15,
    rating: 4.7,
    reviewCount: 567,
    brand: 'Canon',
    features: ['24.2MP Full-Frame Sensor', '40fps Continuous Shooting', '6K RAW Video', 'In-Body Image Stabilization'],
    isFeatured: true
  },
  {
    name: 'Nike Air Max 270',
    price: 150.00,
    originalPrice: 180.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ],
    description: 'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it features Nike\'s biggest heel Air unit yet for a super-soft ride.',
    category: 'Clothing',
    stock: 200,
    rating: 4.4,
    reviewCount: 5678,
    brand: 'Nike',
    features: ['Max Air Unit', 'Mesh Upper', 'Foam Midsole', 'Rubber Outsole'],
    isFeatured: false
  },
  {
    name: 'Dell XPS 15 Laptop',
    price: 1799.00,
    originalPrice: 1999.00,
    image: 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=500',
    images: [
      'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=500'
    ],
    description: 'Dell XPS 15 with 13th Gen Intel Core i7, NVIDIA GeForce RTX 4060. 15.6" OLED 3.5K display delivers stunning visuals. Premium build quality with carbon fiber palm rest.',
    category: 'Laptops',
    stock: 25,
    rating: 4.5,
    reviewCount: 1023,
    brand: 'Dell',
    features: ['13th Gen Intel Core i7', 'RTX 4060 GPU', '15.6" OLED 3.5K Display', '32GB RAM'],
    isFeatured: false
  },
  {
    name: 'Samsung 65" 4K Smart TV',
    price: 897.00,
    originalPrice: 1099.00,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'
    ],
    description: 'Samsung 65" Crystal UHD 4K Smart TV with Dynamic Crystal Color. Features Tizen Smart TV platform with built-in streaming apps. AirSlim design for a sleek look.',
    category: 'Electronics',
    stock: 30,
    rating: 4.3,
    reviewCount: 2345,
    brand: 'Samsung',
    features: ['65" 4K UHD Display', 'Crystal Processor 4K', 'Smart TV (Tizen)', 'Alexa Built-in'],
    isFeatured: true
  },
  {
    name: 'Leather Crossbody Bag',
    price: 89.00,
    originalPrice: 129.00,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'
    ],
    description: 'Premium genuine leather crossbody bag with adjustable strap. Multiple compartments for organized storage. Perfect for everyday use with a classic, timeless design.',
    category: 'Accessories',
    stock: 150,
    rating: 4.2,
    reviewCount: 890,
    brand: 'FashionCo',
    features: ['Genuine Leather', 'Adjustable Strap', 'Multiple Compartments', 'Zip Closure'],
    isFeatured: false
  },
  {
    name: 'Men\'s Classic Polo Shirt',
    price: 45.00,
    originalPrice: 59.00,
    image: 'https://images.unsplash.com/photo-1625910513413-5fc421e0b6cd?w=500',
    images: [
      'https://images.unsplash.com/photo-1625910513413-5fc421e0b6cd?w=500'
    ],
    description: 'Classic fit polo shirt made from premium cotton piqué fabric. Ribbed collar and cuffs with a two-button placket. Available in multiple colors.',
    category: 'Clothing',
    stock: 300,
    rating: 4.1,
    reviewCount: 1567,
    brand: 'PoloStyle',
    features: ['100% Cotton Piqué', 'Classic Fit', 'Ribbed Collar', 'Machine Washable'],
    isFeatured: true
  },
  {
    name: 'Google Pixel 8 Pro',
    price: 899.00,
    originalPrice: 999.00,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'
    ],
    description: 'Google Pixel 8 Pro with Tensor G3 chip and AI-powered camera features. 50MP main camera with Super Res Zoom. 6.7" LTPO OLED display with 120Hz refresh rate.',
    category: 'Mobile Phones',
    stock: 40,
    rating: 4.6,
    reviewCount: 789,
    brand: 'Google',
    features: ['Tensor G3 Chip', '50MP Camera', '6.7" LTPO OLED', '7 Years of Updates'],
    isFeatured: false
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    price: 249.00,
    originalPrice: 279.00,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500'
    ],
    description: 'AirPods Pro 2nd generation with H2 chip. Active Noise Cancellation up to 2x more effective. Adaptive Transparency and Personalized Spatial Audio.',
    category: 'Headphones',
    stock: 120,
    rating: 4.7,
    reviewCount: 4567,
    brand: 'Apple',
    features: ['H2 Chip', '2x Active Noise Cancellation', 'Adaptive Transparency', 'USB-C Charging'],
    isFeatured: true
  },
  {
    name: 'Yoga Mat Premium',
    price: 68.00,
    originalPrice: 85.00,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'
    ],
    description: 'Premium yoga mat with extra thick cushioning for joint support. Non-slip surface for stability during practice. Eco-friendly TPE material, lightweight and portable.',
    category: 'Sports & Outdoors',
    stock: 80,
    rating: 4.3,
    reviewCount: 456,
    brand: 'ZenFit',
    features: ['6mm Thick Cushioning', 'Non-Slip Surface', 'Eco-Friendly TPE', 'Carrying Strap Included'],
    isFeatured: false
  },
  {
    name: 'Smart Home Speaker',
    price: 129.00,
    originalPrice: 159.00,
    image: 'https://images.unsplash.com/photo-1543512214-318228f37c0a?w=500',
    images: [
      'https://images.unsplash.com/photo-1543512214-318228f37c0a?w=500'
    ],
    description: 'Smart speaker with premium sound quality and built-in voice assistant. Controls your smart home devices with voice commands. Multi-room audio support.',
    category: 'Electronics',
    stock: 60,
    rating: 4.4,
    reviewCount: 2134,
    brand: 'TechHome',
    features: ['360° Sound', 'Voice Assistant', 'Smart Home Hub', 'Multi-Room Audio'],
    isFeatured: false
  },
  {
    name: 'Running Shorts - Men\'s',
    price: 35.00,
    originalPrice: 45.00,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'
    ],
    description: 'Lightweight running shorts with built-in liner. Moisture-wicking Dri-FIT technology keeps you dry and comfortable. Zippered pocket for secure storage.',
    category: 'Clothing',
    stock: 250,
    rating: 4.2,
    reviewCount: 890,
    brand: 'SportMax',
    features: ['Dri-FIT Technology', 'Built-in Liner', 'Zippered Pocket', 'Reflective Details'],
    isFeatured: false
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 32.00,
    originalPrice: 42.00,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'
    ],
    description: 'Double-wall vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid. Available in multiple sizes and colors.',
    category: 'Sports & Outdoors',
    stock: 400,
    rating: 4.5,
    reviewCount: 3456,
    brand: 'HydroKeep',
    features: ['Double-Wall Vacuum Insulation', '24hr Cold / 12hr Hot', 'BPA-Free', 'Leak-Proof Lid'],
    isFeatured: false
  },
  {
    name: 'Wireless Gaming Mouse',
    price: 79.00,
    originalPrice: 99.00,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    images: [
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'
    ],
    description: 'High-performance wireless gaming mouse with 25,600 DPI sensor. Ultra-lightweight design at just 63g. RGB lighting with 16.8 million colors.',
    category: 'Electronics',
    stock: 90,
    rating: 4.6,
    reviewCount: 1678,
    brand: 'GamePro',
    features: ['25,600 DPI Sensor', '63g Ultralight', 'RGB Lighting', '70-hour Battery'],
    isFeatured: false
  },
  {
    name: 'Minimalist Leather Watch',
    price: 189.00,
    originalPrice: 249.00,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'
    ],
    description: 'Elegant minimalist watch with genuine leather strap and sapphire crystal glass. Japanese quartz movement for precise timekeeping. Water resistant to 50 meters.',
    category: 'Watches',
    stock: 45,
    rating: 4.4,
    reviewCount: 678,
    brand: 'TimeWear',
    features: ['Sapphire Crystal Glass', 'Japanese Quartz Movement', 'Genuine Leather Strap', '50m Water Resistant'],
    isFeatured: true
  },
  {
    name: 'Backpack - Travel & Daily Use',
    price: 75.00,
    originalPrice: 95.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
    ],
    description: 'Versatile backpack designed for travel and daily use. Features a padded laptop compartment (fits up to 15.6"), anti-theft back pocket, and USB charging port.',
    category: 'Accessories',
    stock: 160,
    rating: 4.3,
    reviewCount: 2345,
    brand: 'TravelPro',
    features: ['15.6" Laptop Compartment', 'Anti-Theft Pocket', 'USB Charging Port', 'Water Resistant'],
    isFeatured: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created (email: admin@ecommerce.com, password: admin123)');

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'user@ecommerce.com',
      password: 'user123',
      role: 'user'
    });
    await testUser.save();
    console.log('Test user created (email: user@ecommerce.com, password: user123)');

    // Insert products
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products seeded successfully`);

    console.log('\n--- Seeding Complete ---');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('User:  user@ecommerce.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
