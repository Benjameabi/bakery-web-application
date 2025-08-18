import { useState, useEffect } from 'react';
import { masterJacobsAPI, Outlet } from '../lib/api';

interface StoreLocation extends Outlet {
  distance?: number; // Distance from user location in km
  isOpen?: boolean;
  nextOpenTime?: string;
}

interface LocationsState {
  locations: StoreLocation[];
  isLoading: boolean;
  error: string | null;
  userLocation?: {
    lat: number;
    lng: number;
  };
}

export function useStoreLocations() {
  const [state, setState] = useState<LocationsState>({
    locations: [],
    isLoading: false,
    error: null
  });

  useEffect(() => {
    loadStoreLocations();
  }, []);

  const loadStoreLocations = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const outlets = await masterJacobsAPI.getOutlets();
      
      // Add Mäster Jacobs main location as fallback if API doesn't return data
      const fallbackLocation: StoreLocation = {
        id: 378,
        name: 'Mäster Jacobs Bageri & Konditori',
        address: 'Pettersbergatan 37',
        city: 'Västerås',
        postalCode: '72212',
        phone: '+46 021-30 15 09',
        openingHours: {
          monday: { open: '06:00', close: '18:00' },
          tuesday: { open: '06:00', close: '18:00' },
          wednesday: { open: '06:00', close: '18:00' },
          thursday: { open: '06:00', close: '18:00' },
          friday: { open: '06:00', close: '18:00' },
          saturday: { open: '07:00', close: '16:00' },
          sunday: { open: '08:00', close: '16:00' }
        },
        coordinates: {
          lat: 59.6099,
          lng: 16.5448
        }
      };

      const locations = outlets.length > 0 ? outlets : [fallbackLocation];
      
      setState(prev => ({
        ...prev,
        locations: locations.map(location => ({
          ...location,
          isOpen: checkIfOpen(location.openingHours)
        })),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error loading store locations:', error);
      setState(prev => ({
        ...prev,
        error: 'Kunde inte ladda butiksplatser',
        isLoading: false
      }));
    }
  };

  const checkIfOpen = (openingHours: Record<string, any>): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight
    
    const todayHours = openingHours[currentDay];
    if (!todayHours) return false;
    
    const openTime = parseTime(todayHours.open);
    const closeTime = parseTime(todayHours.close);
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getDistanceFromUser = async (locationId: number) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      setState(prev => ({
        ...prev,
        userLocation: { lat: userLat, lng: userLng },
        locations: prev.locations.map(location => {
          if (location.id === locationId && location.coordinates) {
            const distance = calculateDistance(
              userLat, userLng, 
              location.coordinates.lat, location.coordinates.lng
            );
            return { ...location, distance };
          }
          return location;
        })
      }));
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getNearestLocation = (): StoreLocation | null => {
    if (!state.userLocation) return state.locations[0] || null;
    
    return state.locations
      .filter(location => location.distance !== undefined)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))[0] || null;
  };

  const getOpenLocations = (): StoreLocation[] => {
    return state.locations.filter(location => location.isOpen);
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    return distance < 1 
      ? `${Math.round(distance * 1000)}m` 
      : `${distance.toFixed(1)}km`;
  };

  const formatOpeningHours = (openingHours: Record<string, any>, day?: string): string => {
    const targetDay = day || new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = openingHours[targetDay];
    
    if (!hours) return 'Stängt';
    return `${hours.open} - ${hours.close}`;
  };

  const getDirectionsUrl = (location: StoreLocation): string => {
    const address = `${location.address}, ${location.city}, ${location.postalCode}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return {
    locations: state.locations,
    isLoading: state.isLoading,
    error: state.error,
    userLocation: state.userLocation,
    reloadLocations: loadStoreLocations,
    getDistanceFromUser,
    getNearestLocation,
    getOpenLocations,
    formatDistance,
    formatOpeningHours,
    getDirectionsUrl
  };
}
