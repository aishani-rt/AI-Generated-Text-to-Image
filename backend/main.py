from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
import requests
import base64
from urllib.parse import quote
import logging
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Settings class for environment variables
class Settings(BaseSettings):
    pollinations_api_url: str = "https://image.pollinations.ai/prompt"
    backend_url: str = "http://127.0.0.1:8000"
    frontend_url: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Initialize FastAPI app
app = FastAPI(
    title="AI Image Generator API",
    description="Generate images from text prompts using AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model with validation
class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, 
                        description="Text description for image generation")
    style: str = Field(default="Realistic", 
                      description="Art style for the image")

# Response model
class ImageResponse(BaseModel):
    image: str = Field(..., description="Base64 encoded image")
    message: str = Field(default="Image generated successfully", 
                        description="Response message")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    details: str = Field(default="", description="Additional details")

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    """
    Check if the API is running.
    Returns status information.
    """
    return {
        "status": "healthy",
        "service": "AI Image Generator API",
        "version": "1.0.0"
    }

# Main image generation endpoint
@app.post("/generate", 
          response_model=ImageResponse,
          tags=["Image Generation"],
          summary="Generate image from prompt")
def generate_image(data: PromptRequest):
    """
    Generate an AI image from a text prompt.
    
    **Parameters:**
    - prompt: Text description of the image
    - style: Art style (Realistic, Anime, Cyberpunk, Oil Painting, Sketch)
    
    **Returns:**
    - Base64 encoded image
    - Status message
    
    **Errors:**
    - 400: Invalid input
    - 500: Image generation failed
    """
    
    try:
        # Validate input
        if not data.prompt or not data.prompt.strip():
            raise HTTPException(
                status_code=400,
                detail="Prompt cannot be empty"
            )
        
        if len(data.prompt) > 1000:
            raise HTTPException(
                status_code=400,
                detail="Prompt is too long (max 1000 characters)"
            )
        
        logger.info(f"Generating image for prompt: {data.prompt[:50]}...")
        
        # Combine prompt and style
        final_prompt = f"{data.style} style, {data.prompt}"
        
        # URL encode the prompt
        encoded_prompt = quote(final_prompt)
        
        # Build API URL
        image_url = f"{settings.pollinations_api_url}/{encoded_prompt}"
        
        logger.info(f"Calling Pollinations API...")
        
        # Call Pollinations API with timeout
        try:
            response = requests.get(image_url, timeout=60)
            response.raise_for_status()
        except requests.exceptions.Timeout:
            logger.error("Timeout while calling Pollinations API")
            raise HTTPException(
                status_code=504,
                detail="Image generation timed out. Please try again."
            )
        except requests.exceptions.ConnectionError:
            logger.error("Connection error with Pollinations API")
            raise HTTPException(
                status_code=503,
                detail="Unable to connect to image generation service"
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to generate image. Please try again."
            )
        
        # Check if response contains valid image data
        if not response.content:
            logger.error("Empty response from Pollinations API")
            raise HTTPException(
                status_code=500,
                detail="No image data received from service"
            )
        
        # Convert binary image to Base64
        try:
            image_base64 = base64.b64encode(response.content).decode("utf-8")
        except Exception as e:
            logger.error(f"Error encoding image: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to process image data"
            )
        
        logger.info("Image generated successfully")
        
        return ImageResponse(
            image=image_base64,
            message="Image generated successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again."
        )

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": exc.detail,
        "details": "Please check your input and try again"
    }

# Root endpoint
@app.get("/", tags=["Info"])
def root():
    """
    API information and documentation
    """
    return {
        "message": "AI Image Generator API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "generate": "/generate"
        },
        "documentation": "Visit /docs for interactive documentation"
    }

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )