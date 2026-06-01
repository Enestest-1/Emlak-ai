from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from gemini_service import get_property_valuation

app = FastAPI(title="Emlak AI API")

# CORS ayarları - React Native uyumlu
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ValuationRequest(BaseModel):
    city: str
    district: str
    sqm: float
    rooms: str
    floor: int
    building_age: int
    furnished: bool
    in_complex: bool


class ValuationResponse(BaseModel):
    min_price: int
    max_price: int
    avg_sqm_price: int
    factors: list[str]


@app.post("/api/valuate", response_model=ValuationResponse)
async def valuate(request: ValuationRequest) -> ValuationResponse:
    """
    Türkiye emlak değerleme endpoint'i
    """
    valuation = get_property_valuation(
        city=request.city,
        district=request.district,
        sqm=request.sqm,
        rooms=request.rooms,
        floor=request.floor,
        building_age=request.building_age,
        furnished=request.furnished,
        in_complex=request.in_complex,
    )
    return ValuationResponse(**valuation)


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    # Render ve diğer platformlar PORT environment variable'ı kullanırlar
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
