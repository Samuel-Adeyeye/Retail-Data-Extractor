import os
import json
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="Retail Data Extractor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
api_key = os.getenv("VITE_GOOGLE_GEMINI_API_KEY") or os.getenv("Google_Gemini_API_Key")
if not api_key:
    print("Warning: API Key not found in environment variables.")

client = None
if api_key:
    client = genai.Client(api_key=api_key)

class Product(BaseModel):
    id: str
    name: str
    price: str
    description: str
    brand: str
    discount: Optional[str] = None
    unit: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Retail Data Extractor API is running"}

@app.post("/extract", response_model=List[Product])
async def extract_data(file: UploadFile = File(...)):
    if not client:
        raise HTTPException(status_code=500, detail="Server configuration error: API Key missing")

    try:
        # Read file content
        content = await file.read()
        
        # Prepare prompt
        prompt = """
        Analyze this retail leaflet image and extract all product information.
        Return ONLY a valid JSON array of objects. Do not include markdown formatting like ```json.
        
        Each object should have the following fields:
        - id: Generate a unique string ID (e.g., "p1", "p2")
        - name: Product name
        - price: Price as a string (include currency symbol)
        - description: Brief description if available, or generate a short one based on the name/image
        - brand: Brand name if visible, otherwise "Unknown"
        - discount: Discount details if visible (e.g., "20% OFF", "Buy 1 Get 1"), otherwise null
        - unit: Unit size if visible (e.g., "500g", "1L", "Pack of 6"), otherwise null
        
        If you cannot find any products, return an empty array [].
        """
        
        # Generate content
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=[
                types.Content(
                    parts=[
                        types.Part.from_bytes(
                            data=content,
                            mime_type=file.content_type
                        ),
                        types.Part.from_text(text=prompt)
                    ]
                )
            ]
        )
        
        text = response.text
        
        # Clean up potential markdown code blocks
        clean_text = text.replace('```json', '').replace('```', '').strip()
        
        try:
            data = json.loads(clean_text)
            return data
        except json.JSONDecodeError:
            print(f"Failed to parse JSON: {clean_text}")
            raise HTTPException(status_code=500, detail="Failed to parse model response")
            
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        error_msg = str(e)
        if "429" in error_msg or "Quota" in error_msg:
             raise HTTPException(status_code=429, detail="API Quota Exceeded. Please try again later.")
        raise HTTPException(status_code=500, detail=error_msg)
