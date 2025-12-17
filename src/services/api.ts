import type { Product } from '../types';

const API_URL = 'http://localhost:8000';

export const extractDataFromImage = async (file: File): Promise<Product[]> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to extract data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error extracting data:', error);
    throw error;
  }
};
