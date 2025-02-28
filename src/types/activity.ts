export interface Activity {
  id: number;
  city: string;
  country: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  distance: string;
  transport: string;
  image: string;
  tags: string[];
  address: string;
  openingHours: string[];
  transportDetails: string;
  bookingUrl: string;
  accessible?: boolean;
  accessibilityFeatures?: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  // Optional food-specific properties
  cuisine?: string;
  mealType?: string;
  ambiance?: string;
  dietary?: string;
  taste?: string;
}
