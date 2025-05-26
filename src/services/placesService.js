// // https://maps.googleapis.com/maps/api/place/nearbysearch/json
// ?key=…&location=<lat>,<lng>&radius=100&type=mosque
// src/services/placesService.js

import axios from 'axios';
import {
  GOOGLE_PLACES_KEY,
  PLACES_RADIUS_METERS,
  PLACES_NEARBY_URL,
} from '../config/placesConfig.js';

/**
 * Call Google Places Nearby Search to find mosques near the given coords.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Array<{ place_id: string, name: string, lat: number, lng: number }>>}
 */
export async function getNearbyMosques(latitude, longitude) {
  const resp = await axios.get(PLACES_NEARBY_URL, {
    params: {
      key:      GOOGLE_PLACES_KEY,
      location: `${latitude},${longitude}`,
      radius:   PLACES_RADIUS_METERS,
      type:     'mosque',
    }
  });

  if (resp.data.status !== 'OK' && resp.data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API error: ${resp.data.status}`);
  }

  // Map to a simpler shape
  return (resp.data.results || []).map((place) => ({
    place_id: place.place_id,
    name:     place.name,
    lat:      place.geometry.location.lat,
    lng:      place.geometry.location.lng,
  }));
}
