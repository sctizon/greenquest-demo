import { API_URL } from '../constants/constants';

// Fetch user profile data
export const fetchUserProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    return null;
  }
};