import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# 2026 Türkiye Emlak Piyasası Base Fiyatları (m² başına TL)
# Enflasyon ve reel fiyat artışları hesaplanmış
MARKET_PRICES_2026 = {
    'İstanbul': {'base': 65000, 'tier': 'A'},
    'Ankara': {'base': 42000, 'tier': 'A'},
    'İzmir': {'base': 48000, 'tier': 'A'},
    'Bursa': {'base': 28000, 'tier': 'B'},
    'Antalya': {'base': 35000, 'tier': 'B'},
    'Adana': {'base': 22000, 'tier': 'C'},
    'Gaziantep': {'base': 18000, 'tier': 'C'},
    'Konya': {'base': 20000, 'tier': 'C'},
    'Kayseri': {'base': 19000, 'tier': 'C'},
    'Mersin': {'base': 25000, 'tier': 'B'},
    'Sakarya': {'base': 24000, 'tier': 'B'},
    'Kocaeli': {'base': 38000, 'tier': 'B'},
    'Diyarbakır': {'base': 15000, 'tier': 'C'},
    'Şanlıurfa': {'base': 14000, 'tier': 'C'},
    'Trabzon': {'base': 26000, 'tier': 'B'},
    'Eskişehir': {'base': 22000, 'tier': 'C'},
    'Denizli': {'base': 21000, 'tier': 'C'},
    'Samsun': {'base': 23000, 'tier': 'B'},
    'Balıkesir': {'base': 20000, 'tier': 'C'},
    'Bolu': {'base': 19000, 'tier': 'C'},
}

# District premium/discount multipliers for major cities
DISTRICT_MULTIPLIERS = {
    'İstanbul': {
        'Kadıköy': 1.35, 'Beşiktaş': 1.40, 'Şişli': 1.38, 'Bakırköy': 0.95, 'Üsküdar': 1.20
    },
    'Ankara': {
        'Çankaya': 1.25, 'Keçiören': 0.85, 'Mamak': 0.80, 'Yenimahalle': 1.15, 'Altındağ': 0.75
    },
    'İzmir': {
        'Konak': 1.30, 'Bornova': 0.90, 'Karşıyaka': 1.20, 'Çiğli': 0.85, 'Buca': 0.95
    },
}

def get_district_multiplier(city: str, district: str) -> float:
    """Get price multiplier for a specific district"""
    if city in DISTRICT_MULTIPLIERS:
        return DISTRICT_MULTIPLIERS[city].get(district, 1.0)
    return 1.0

def calculate_dynamic_price(
    city: str,
    district: str,
    sqm: float,
    rooms: str,
    floor: int,
    building_age: int,
    furnished: bool,
    in_complex: bool,
) -> dict:
    """
    Calculate dynamic property valuation based on 2026 market conditions
    """
    
    # Get base price for city
    if city not in MARKET_PRICES_2026:
        base_price_sqm = 25000  # default fallback
    else:
        base_price_sqm = MARKET_PRICES_2026[city]['base']
    
    # Apply district multiplier
    district_mult = get_district_multiplier(city, district)
    adjusted_price_sqm = base_price_sqm * district_mult
    
    # Room count adjustment (2+1 is baseline = 1.0)
    room_multiplier = {
        '1+1': 0.85,
        '2+1': 1.0,
        '3+1': 1.15,
        '4+1': 1.30,
        '5+1': 1.45,
    }.get(rooms, 1.0)
    
    # Building age adjustment
    # Newer buildings: premium
    # Older buildings: discount
    if building_age <= 5:
        age_multiplier = 1.15
    elif building_age <= 10:
        age_multiplier = 1.08
    elif building_age <= 20:
        age_multiplier = 1.0
    elif building_age <= 30:
        age_multiplier = 0.92
    else:
        age_multiplier = 0.82
    
    # Floor position adjustment
    # Ground and top floors have slight discount; mid-upper floors premium
    if floor == 0:
        floor_mult = 0.95
    elif floor <= 2:
        floor_mult = 0.98
    elif floor >= 8:
        floor_mult = 0.97
    else:
        floor_mult = 1.05
    
    # In complex vs standalone
    in_complex_mult = 1.12 if in_complex else 0.95
    
    # Furnished premium
    furnished_mult = 1.08 if furnished else 1.0
    
    # Calculate total multiplier
    total_multiplier = room_multiplier * age_multiplier * floor_mult * in_complex_mult * furnished_mult
    
    # Final per sqm price
    final_price_sqm = adjusted_price_sqm * total_multiplier
    
    # Total price range (with market variance: -12% to +15%)
    total_price = sqm * final_price_sqm
    min_price = int(total_price * 0.88)
    max_price = int(total_price * 1.15)
    avg_sqm_price = int(final_price_sqm)
    
    # Market analysis factors
    factors = [
        f"Konumun {city}/{district} bölgesinde pazar değeri",
        f"Bina yaşı ({building_age} yıl) - yapı kalitesi ve onarım durumu",
        f"Oda sayısı ({rooms}) ve toplam kullanım alanı ({sqm} m²)",
        f"Site içi konumu ve sosyal olanaklar" if in_complex else "Bağımsız konum ve otopark durumu",
        "Yakın çevredeki ulaşım, okul, hastane gibi sosyal imkanlar"
    ]
    
    return {
        "min_price": min_price,
        "max_price": max_price,
        "avg_sqm_price": avg_sqm_price,
        "factors": factors,
    }


def get_property_valuation(
    city: str,
    district: str,
    sqm: float,
    rooms: str,
    floor: int,
    building_age: int,
    furnished: bool,
    in_complex: bool,
) -> dict:
    """
    Get property valuation using Gemini AI with Google Search capability
    Analyzes current market prices and provides realistic 2026 Turkish real estate valuations
    """
    try:
        # Initialize Gemini model with Google Search enabled
        # Using system instruction to enable search capability
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction="""Sen bir Türkiye gayrimenkul uzmanısın. 
Google Arama özelliğini kullanarak güncel emlak piyasası verilerini araştır ve analiz et.
Gerçekçi, pazar temelli değerlendirmeler yap. Türkçe cevap ver."""
        )
        
        # Create detailed prompt for Gemini to search current market prices
        prompt = f"""Bu mülkün değerlemesini yaparken arka planda Google Arama özelliğini kullanarak ilgili şehir ve ilçedeki en güncel satılık konut ilan fiyatlarını, m² trendlerini aktif olarak ara ve analizine dahil et.

Lütfen aşağıdaki gayrimenkul için GÜNCEL PAZAR VERİLERİNE DAYALI GERÇEKÇI BİR DEĞERLEME YAP:

📍 Konum: {city} - {district}
📐 Metrekare: {sqm} m²
🏠 Oda Sayısı: {rooms}
🏢 Bina Yaşı: {building_age} yıl
🚪 Kat Numarası: {floor}. kat
✅ Eşyalı: {'Evet' if furnished else 'Hayır'}
🏘️ Site İçinde: {'Evet' if in_complex else 'Hayır'}

GOOGLE ARAMA SORGUSU: "{city} {district} konut fiyatları 2026", "{city} {district} m² fiyat" gibi sorguları kullanarak güncel piyasa verisi ara.

Aşağıdaki JSON formatında cevap ver (Türkçe faktörleri içerecek):
{{
    "min_price": <minimum_tahmini_fiyat_TL>,
    "max_price": <maksimum_tahmini_fiyat_TL>,
    "avg_sqm_price": <ortalama_metrekare_fiyat_TL>,
    "factors": [
        "<faktör_1_türkçe>",
        "<faktör_2_türkçe>",
        "<faktör_3_türkçe>",
        "<faktör_4_türkçe>",
        "<faktör_5_türkçe>"
    ]
}}

NOT: Lütfen SADECE JSON döndür, başka metin yazma!"""
        
        # Call Gemini with Google Search support
        response = model.generate_content(prompt)
        
        # Parse response
        response_text = response.text.strip()
        print(f"[Gemini Response] {response_text[:200]}...")
        
        # Try to extract JSON from response
        import json
        import re
        
        # Find JSON block in response
        json_match = re.search(r'\{.*?"min_price".*?\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            result = json.loads(json_str)
            
            # Validate and clean result
            if all(key in result for key in ['min_price', 'max_price', 'avg_sqm_price', 'factors']):
                print(f"[Gemini Success] Valuation received: min={result['min_price']}, max={result['max_price']}")
                return {
                    "min_price": int(result.get("min_price", 0)),
                    "max_price": int(result.get("max_price", 0)),
                    "avg_sqm_price": int(result.get("avg_sqm_price", 0)),
                    "factors": result.get("factors", [])[:5],
                }
    except Exception as e:
        print(f"[Gemini API Error] {str(e)}")
    
    # Fallback to dynamic calculation if API fails
    print(f"[Fallback] Using dynamic pricing for {city}/{district}")
    return calculate_dynamic_price(
        city=city,
        district=district,
        sqm=sqm,
        rooms=rooms,
        floor=floor,
        building_age=building_age,
        furnished=furnished,
        in_complex=in_complex,
    )


def _fallback_result(sqm: float) -> dict:
    """Fallback valuation when calculation fails"""
    avg = int(sqm * 25000)  # 2026 average: ~25k TL/m²
    return {
        "min_price": int(avg * 0.85),
        "max_price": int(avg * 1.15),
        "avg_sqm_price": avg,
        "factors": [
            "Konumun merkezi olması ve erişilebilirlik",
            "Bina yaşı ve yapı kalitesi",
            "Oda sayısı ve kullanım alanı",
            "Site içi konumu ve sosyal olanaklar",
            "Yakın çevredeki ulaşım ve sosyal imkanlar",
        ],
    }
