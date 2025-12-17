import type { Product } from '../types';

const API_URL = 'http://localhost:8000';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const extractDataFromImage = async (file: File): Promise<Product[]> => {
  const formData = new FormData();
  formData.append('file', file);

  const maxRetries = 3;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(`${API_URL}/extract`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }

      // Handle non-OK responses
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      
      // Specifically check for 429 Too Many Requests
      if (response.status === 429) {
        attempt++;
        if (attempt <= maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(`Quota exceeded (429). Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
          await wait(delay);
          continue; // Retry loop
        }
      }

      // If not 429 or retries exhausted, throw error
      throw new Error(errorData.detail || 'Failed to extract data');

    } catch (error) {
      // If it's a network error (fetch failed), we might also want to retry, but for now 
      // we focus on the logic flow. If 'continue' was hit, we won't be here.
      // If we are here, it's either a final error or a throw from above.
      
      // If the error was manually thrown above (checking for response.ok), rethrow it.
      // But if fetch itself failed (network down), the loop would break unless we catch and retry.
      // For 429 handling specifically, the logic is inside the try block.
      // We only catch here to log or rethrow final errors.
      
      if (attempt < maxRetries && (error as Error).message === 'Failed to fetch') {
         // Optional: Retry on network failure too if desired, but sticking to 429 for now as requested.
      }
      
      console.error('Error extracting data:', error);
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
};
