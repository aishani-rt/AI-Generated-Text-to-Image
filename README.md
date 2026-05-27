cat > README.md << 'EOF'
# ✨ AI Image Generator

A modern web application that generates AI images from text prompts. Built with React, FastAPI, and powered by Pollinations AI.

## 🎯 Features

- 🎨 **Text-to-Image Generation** - Describe what you want, AI creates it
- 🎭 **Multiple Art Styles** - Realistic, Anime, Cyberpunk, Oil Painting, Sketch, and more
- ⚡ **Fast & Responsive** - Modern async backend with real-time feedback
- 📥 **Download Images** - Save generated images locally
- 🎯 **Production Ready** - Error handling, validation, and smooth UX
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Frontend:**
- React 18+ with Hooks
- Tailwind CSS for styling
- Vite for build optimization
- Axios for API requests

**Backend:**
- FastAPI (Python)
- Pydantic for data validation
- Uvicorn ASGI server
- Pollinations AI for image generation

## 📋 Prerequisites

- Node.js 16+ (for frontend)
- Python 3.9+ (for backend)
- npm or yarn (for frontend)
- pip (for backend)

## 🚀 Installation & Setup

### Step 1: Clone Repository

\`\`\`bash
git clone https://github.com/yourusername/ai-image-generator.git
cd ai-image-generator
\`\`\`

### Step 2: Backend Setup

\`\`\`bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

### Step 3: Frontend Setup

\`\`\`bash
cd ../frontend
npm install
\`\`\`

## 🏃 Running the Application

### Start Backend (Terminal 1)

\`\`\`bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload
\`\`\`

### Start Frontend (Terminal 2)

\`\`\`bash
cd frontend
npm run dev
\`\`\`

## 📖 How to Use

1. **Enter Prompt** - Describe the image you want to generate
2. **Choose Style** - Select an art style (Realistic, Anime, etc.)
3. **Generate** - Click "Generate Image" button
4. **Wait** - Image generation takes 10-30 seconds
5. **Download** - Click "Download Image" to save

## 📁 Project Structure

\`\`\`
ai-image-generator/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── README.md
└── .gitignore
\`\`\`

## 🎨 Art Styles Available

- Realistic
- Anime
- Cyberpunk
- Oil Painting
- Sketch
- Digital Art
- Watercolor
- Comic Book

## 📝 License

MIT License

## 👨‍💻 Author

Created as an AI Image Generator internship project

---

**Made with ❤️ for AI and web development**
EOF