// src/config/placesConfig.js

import dotenv from 'dotenv';
dotenv.config();

export const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!GOOGLE_PLACES_KEY) {
  console.error('❌ Missing GOOGLE_PLACES_API_KEY in your .env');
  process.exit(1);
}

// Radius (in meters) within which we consider “on-site”
export const PLACES_RADIUS_METERS = 100;

// Base URL for the Places Nearby Search API
export const PLACES_NEARBY_URL =
  'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
