const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
) => {
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth APIs
export const authAPI = {
  signup: (payload: any) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (mobile: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    }),

  getProfile: (token: string) =>
    apiCall('/auth/profile', { method: 'GET' }, token),
};

// Crop APIs
export const cropAPI = {
  createCrop: (payload: any, token: string) =>
    apiCall('/crops', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token),

  getCrops: (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'All' && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
    }
    return apiCall(`/crops?${params.toString()}`, { method: 'GET' });
  },

  getCropById: (id: string) =>
    apiCall(`/crops/${id}`, { method: 'GET' }),

  getFarmerCrops: (token: string) =>
    apiCall('/crops/farmer/my-crops', { method: 'GET' }, token),

  updateCrop: (id: string, payload: any, token: string) =>
    apiCall(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token),

  deleteCrop: (id: string, token: string) =>
    apiCall(`/crops/${id}`, { method: 'DELETE' }, token),
};

// Bid APIs
export const bidAPI = {
  placeBid: (payload: any, token: string) =>
    apiCall('/bids', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token),

  getMyBids: (token: string) =>
    apiCall('/bids/my/bids', { method: 'GET' }, token),

  getBidsForCrop: (cropId: string) =>
    apiCall(`/bids/crop/${cropId}/bids`, { method: 'GET' }),

  getHighestBid: (cropId: string) =>
    apiCall(`/bids/crop/${cropId}/highest`, { method: 'GET' }),
};
