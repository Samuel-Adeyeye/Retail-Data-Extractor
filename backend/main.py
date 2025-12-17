import os
import json
import base64
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
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

# Configure Groq
# User specified key name: VITE_Groq_API_KEY
api_key = os.getenv("VITE_Groq_API_KEY") or os.getenv("GROQ_API_KEY")
if not api_key:
    print("Warning: Groq API Key not found in environment variables.")

client = None
if api_key:
    client = Groq(api_key=api_key)

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
        
        # Encode image to base64
        base64_image = base64.b64encode(content).decode('utf-8')
        data_url = f"data:{file.content_type};base64,{base64_image}"
        
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
        
        # Generate content with Groq
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url,
                            },
                        },
                    ],
                }
            ],
            model="llama-3.2-11b-vision-preview",
            temperature=0, # Low temperature for more deterministic JSON
            max_tokens=2048,
        )
        
        text = chat_completion.choices[0].message.content
        
        # Clean up potential markdown code blocks
        clean_text = text.replace('```json', '').replace('```', '').strip()
        
        try:
            data = json.loads(clean_text)
            return data
        except json.JSONDecodeError:
            print(f"Failed to parse JSON: {clean_text}")
            # Try to salvage partial JSON or list if it was wrapped in something else
            # But for now, just return error
            raise HTTPException(status_code=500, detail="Failed to parse model response. Model might not have returned valid JSON.")
            
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        error_msg = str(e)
        # Groq rate limit errors usually contain 429 too
        if "429" in error_msg:
             raise HTTPException(status_code=429, detail="Groq API Rate Limit Exceeded. Please try again later.")
        raise HTTPException(status_code=500, detail=error_msg)
