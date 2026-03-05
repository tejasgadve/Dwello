/**
 * Dwello Seed Data
 * Run: npm run seed
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use local .env or hardcode for seed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Dwello';

const User = require('../models/User');
const Property = require('../models/Property');
const Review = require('../models/Review');

const users = [
  {
    name: 'Admin User',
    email: 'admin@Dwello.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
    college: '',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    role: 'student',
    phone: '9876543211',
    college: 'IIT Delhi',
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    role: 'student',
    phone: '9876543212',
    college: 'Delhi University',
  },
  {
    name: 'Suresh Kumar',
    email: 'suresh@example.com',
    password: 'password123',
    role: 'owner',
    phone: '9876543213',
    college: '',
  },
  {
    name: 'Meena Gupta',
    email: 'meena@example.com',
    password: 'password123',
    role: 'owner',
    phone: '9876543214',
    college: '',
  },
];

const getProperties = (ownerIds) => [
  {
    title: 'Sunshine PG for Boys - Near IIT Delhi',
    description: 'Comfortable and affordable PG accommodation for boys near IIT Delhi. Fully furnished rooms with all modern amenities. Safe and secure environment with 24/7 security.',
    type: 'PG',
    price: 8000,
    deposit: 16000,
    address: { street: '42, Hauz Khas Village', city: 'New Delhi', state: 'Delhi', pincode: '110016' },
    location: { type: 'Point', coordinates: [77.1995, 28.5494] },
    nearbyColleges: [{ name: 'IIT Delhi', distance: 0.5 }, { name: 'Delhi University', distance: 3.2 }],
    genderPreference: 'Boys',
    occupancy: 'Double',
    furnishing: 'Furnished',
    amenities: { wifi: true, food: true, parking: true, ac: true, security: true, powerBackup: true, hotWater: true, cctv: true },
    images: [
      { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
    ],
    owner: ownerIds[0],
    isFeatured: true,
    'ratings.average': 4.5,
    'ratings.count': 12,
  },
  {
    title: 'Green Valley Girls PG - Safe & Secure',
    description: 'Exclusive PG for girls in a safe and well-maintained locality near Delhi University. Home-cooked meals, clean rooms, and a friendly atmosphere. Curfew policy in place for security.',
    type: 'PG',
    price: 9500,
    deposit: 19000,
    address: { street: '15, North Campus Road', city: 'New Delhi', state: 'Delhi', pincode: '110007' },
    location: { type: 'Point', coordinates: [77.2090, 28.6882] },
    nearbyColleges: [{ name: 'Delhi University', distance: 0.3 }, { name: 'Miranda House', distance: 0.8 }],
    genderPreference: 'Girls',
    occupancy: 'Single',
    furnishing: 'Furnished',
    amenities: { wifi: true, food: true, ac: true, security: true, hotWater: true, cctv: true, housekeeping: true, laundry: true },
    images: [
      { url: 'https://images.unsplash.com/photo-1617104678098-de229db51175?w=800' },
      { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' },
    ],
    owner: ownerIds[1],
    isFeatured: true,
    'ratings.average': 4.8,
    'ratings.count': 23,
  },
  {
    title: 'Student Hub - Co-ed Flat near Mumbai University',
    description: 'Modern 3BHK flat available for sharing. Co-ed accommodation with separate floors for boys and girls. Minutes away from Mumbai University. Great connectivity to public transport.',
    type: 'Flat',
    price: 12000,
    deposit: 24000,
    address: { street: '88, Santacruz West', city: 'Mumbai', state: 'Maharashtra', pincode: '400054' },
    location: { type: 'Point', coordinates: [72.8397, 19.0760] },
    nearbyColleges: [{ name: 'Mumbai University', distance: 1.2 }, { name: 'SNDT University', distance: 2.5 }],
    genderPreference: 'Co-ed',
    occupancy: 'Triple',
    furnishing: 'Semi-furnished',
    amenities: { wifi: true, parking: true, security: true, powerBackup: true },
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
    ],
    owner: ownerIds[0],
    isFeatured: false,
    'ratings.average': 4.2,
    'ratings.count': 8,
  },
  {
    title: 'Campus View Hostel - Budget Stay for Boys',
    description: 'Affordable hostel accommodation for male students near Anna University, Chennai. Clean dormitory-style rooms and a lively community of students.',
    type: 'Hostel',
    price: 5500,
    deposit: 5500,
    address: { street: '22, Sardar Patel Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600025' },
    location: { type: 'Point', coordinates: [80.2209, 13.0067] },
    nearbyColleges: [{ name: 'Anna University', distance: 0.7 }, { name: 'IIT Madras', distance: 2.0 }],
    genderPreference: 'Boys',
    occupancy: 'Triple',
    furnishing: 'Furnished',
    amenities: { wifi: true, food: true, security: true, hotWater: true },
    images: [
      { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800' },
    ],
    owner: ownerIds[1],
    isFeatured: false,
    'ratings.average': 3.9,
    'ratings.count': 15,
  },
  {
    title: 'Luxe Living - Premium PG Near BITS Pilani',
    description: 'Upscale PG accommodation for serious students. Premium rooms with A/C, high-speed internet, and study areas. All inclusive monthly package with food and laundry.',
    type: 'PG',
    price: 15000,
    deposit: 30000,
    address: { street: '7, Vidya Vihar', city: 'Pilani', state: 'Rajasthan', pincode: '333031' },
    location: { type: 'Point', coordinates: [75.5949, 28.3674] },
    nearbyColleges: [{ name: 'BITS Pilani', distance: 0.2 }],
    genderPreference: 'Co-ed',
    occupancy: 'Single',
    furnishing: 'Furnished',
    amenities: { wifi: true, food: true, ac: true, laundry: true, gym: true, security: true, powerBackup: true, hotWater: true, housekeeping: true, cctv: true, tv: true },
    images: [
      { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800' },
      { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
    ],
    owner: ownerIds[0],
    isFeatured: true,
    'ratings.average': 4.9,
    'ratings.count': 31,
  },
  {
    title: 'The Scholar\'s Den - Flat Near Pune University',
    description: 'Comfortable 2BHK flat for 4 students near Pune University. Great location with easy access to metro. Fully equipped kitchen and study room.',
    type: 'Flat',
    price: 7500,
    deposit: 15000,
    address: { street: '55, Deccan Gymkhana', city: 'Pune', state: 'Maharashtra', pincode: '411004' },
    location: { type: 'Point', coordinates: [73.8396, 18.5204] },
    nearbyColleges: [{ name: 'Pune University', distance: 1.0 }, { name: 'Fergusson College', distance: 0.5 }],
    genderPreference: 'Co-ed',
    occupancy: 'Double',
    furnishing: 'Semi-furnished',
    amenities: { wifi: true, parking: true, security: true },
    images: [
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
    ],
    owner: ownerIds[1],
    isFeatured: false,
    'ratings.average': 4.1,
    'ratings.count': 7,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    const ownerIds = createdUsers.filter((u) => u.role === 'owner').map((u) => u._id);
    const properties = getProperties(ownerIds);

    // Manually handle nested field setting
    const propsToCreate = properties.map((p) => {
      const { 'ratings.average': avg, 'ratings.count': count, ...rest } = p;
      return { ...rest, ratings: { average: avg || 0, count: count || 0 } };
    });

    const createdProperties = await Property.insertMany(propsToCreate);
    console.log(`Created ${createdProperties.length} properties`);

    // Add sample reviews
    const studentIds = createdUsers.filter((u) => u.role === 'student').map((u) => u._id);
    const reviews = [
      { property: createdProperties[0]._id, user: studentIds[0], rating: 5, comment: 'Excellent PG! Clean rooms, great food, and very safe. Highly recommended for students.' },
      { property: createdProperties[0]._id, user: studentIds[1], rating: 4, comment: 'Good location and friendly staff. Could improve the WiFi speed.' },
      { property: createdProperties[1]._id, user: studentIds[0], rating: 5, comment: 'Best girls PG I have stayed in. Very safe and the owner is very helpful.' },
      { property: createdProperties[4]._id, user: studentIds[1], rating: 5, comment: 'Premium quality accommodation. Worth every rupee.' },
    ];

    await Review.insertMany(reviews);
    console.log(`Created ${reviews.length} reviews`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin:   admin@Dwello.com / admin123');
    console.log('Student: rahul@example.com / password123');
    console.log('Owner:   suresh@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
