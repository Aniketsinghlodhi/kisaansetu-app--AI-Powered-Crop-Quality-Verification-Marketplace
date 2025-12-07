export interface Crop {
  _id: string;
  farmerId: {
    _id: string;
    name: string;
    location: string;
    rating: number;
  };
  cropName: string;
  category: string;
  quantity: number;
  unit: string;
  basePrice: number;
  imageUrl: string;
  aiGrade: string;
  qualityScore: number;
  location: string;
  description: string;
  status: 'active' | 'sold' | 'expired';
  currentBid: number;
  bidCount: number;
  highestBidder?: string;
  createdAt: string;
}

export interface Bid {
  _id: string;
  cropId: string;
  buyerId: {
    _id: string;
    name: string;
    mobile: string;
    location: string;
  };
  bidAmount: number;
  status: 'active' | 'won' | 'lost';
  createdAt: string;
}
