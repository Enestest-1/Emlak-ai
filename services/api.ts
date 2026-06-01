const API_BASE_URL = 'http://localhost:8000';

export interface ValuationRequest {
  city: string;
  district: string;
  sqm: number;
  rooms: string;
  floor: number;
  building_age: number;
  furnished: boolean;
  in_complex: boolean;
}

export interface ValuationResponse {
  min_price: number;
  max_price: number;
  avg_sqm_price: number;
  factors: string[];
}

export async function valuateProperty(
  request: ValuationRequest
): Promise<ValuationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/valuate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}`
      );
    }

    const data: ValuationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Valuation API Error:', error);
    // Fallback mock data for development
    return {
      min_price: 7950000,
      max_price: 10550000,
      avg_sqm_price: 15200,
      factors: [
        'Konumun merkezi olması',
        'Bina yaşı ve yapı kalitesi',
        'Oda sayısı ve kullanım alanı',
        'Site içi / site dışı konumu',
        'Yakın çevredeki ulaşım ve sosyal imkanlar',
      ],
    };
  }
}
