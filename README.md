# Retail Data Extractor - Project Documentation

## 1. Project Overview
The **Retail Data Extractor** is a web application designed to automate the extraction of product information from retail leaflets. It leverages **Groq (Llama 3.2 Vision)** for fast, multimodal analysis to identify products, prices, brands, and other metadata directly from images.

## 2. Architecture & Technology Stack
I chose a **Client-Server** architecture for this solution to meet the "runnable Python application" requirement.

-   **Frontend**: **React** (with TypeScript) via **Vite**.
    -   Handles the UI, image upload, and data visualization.
-   **Backend**: **Python (FastAPI)**.
    -   Exposes a REST API (`POST /extract`) to process images.
    -   Interacts with **Groq** (`llama-3.2-11b-vision-preview`) via the `groq` Python SDK.
-   **AI Integration**: **Groq**.
    -   Performs the multimodal analysis (Vision + Text) using Llama 3.2.

## 3. Step-by-Step Implementation Process

### Phase 1: Foundation & UI Skeleton
1.  **Project Setup**: Initialized a Vite + React + TypeScript project.
2.  **Theming**: Defined a dark color palette (`#0f172a` background, `#06b6d4` primary).
3.  **Component Design**: Built `UploadZone`, `DataTable`, and `Modal` components.

### Phase 2: Python Backend (FastAPI)
1.  **Server Setup**: Created a `backend/` directory with a FastAPI application.
2.  **API Endpoint**: Implemented `POST /extract` to accept image uploads.
3.  **Gemini Integration**: Configured the backend to send the image to Gemini and parse the JSON response.
4.  **CORS**: Configured Cross-Origin Resource Sharing to allow the frontend to communicate with the backend.

### Phase 3: Frontend Integration
1.  **Service Layer**: Updated the frontend service to send `FormData` to the Python backend instead of calling Gemini directly.
2.  **Data Wiring**: Connected the API response to the React state.

### Phase 4: Refinement & Polish
1.  **Data Export**: Implemented client-side JSON export (`data.json`).
2.  **UX Improvements**: Added loading states and error handling.

## 4. How to Run

### Prerequisites
-   Node.js installed.
-   Python 3.9+ installed.

### Step 1: Start the Backend
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the server:
    ```bash
    uvicorn main:app --reload
    ```
    The server will run at `http://localhost:8000`.

5.  Create a `.env` file in the root directory (or use the one in `retail-data-extractor/`):
    ```env
    VITE_Groq_API_KEY=your_groq_api_key_here
    ```
    (Note: Get your key from [console.groq.com](https://console.groq.com/keys)).

### Step 2: Start the Frontend
1.  Open a new terminal and navigate to the project root (`retail-data-extractor`).
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the URL shown (usually `http://localhost:5173`).

### Step 3: Usage
1.  Drag a leaflet image into the upload zone.
2.  The frontend will send the image to the Python backend.
3.  The backend will process it with Gemini and return the data.
4.  View the results in the table and export as JSON.

## 5. Troubleshooting
- **ModuleNotFoundError**: If you see an error about `groq`, ensure you have installed dependencies: `pip install -r requirements.txt`.
- **429 Errors**: Groq has generous free limits, but if you hit them, the app works with retry logic.
