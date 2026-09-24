<div align="center">

# 🍳 FridgeTORecipe

### *Turn Your Fridge Into Delicious Recipes*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

**FridgeFusion** is an AI-powered recipe generator that transforms your available kitchen ingredients into complete, chef-quality recipes — with step-by-step instructions, nutritional info, and beautiful presentation.

[🚀 Live Demo](#deployment) · [📖 Documentation](#how-it-works) · [🐛 Report Bug](https://github.com/officialankit18/Fridge-to-Fusion/issues)

---

</div>

## PROJECT OVERVIEW

Users enter the ingredients available in their kitchen. The Express backend sends that request to Gemini with a strict structured-JSON prompt, validates the response, and returns recipe data. The React + Vite frontend parses that data and renders interactive recipe cards rather than a chatbot conversation.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Recipe Generation** | Powered by Google Gemini — generates diverse structured recipes per request |
| 🧾 **Structured JSON** | Gemini output is parsed and validated before it reaches the UI |
| ✅ **Cooking Checklist** | Check off each cooking step without changing the original recipe |
| ⚖️ **Serving Scaler** | Increase or decrease servings and scale ingredient quantities cleanly |
| 🔁 **Ingredient Swaps** | See alternatives suggested by Gemini for each recipe |
| 🌙 **Dark Mode** | Full dark theme with carefully crafted color tokens for every component |
| 📸 **Real Food Photography** | High-quality AI-generated images, no vector placeholders |
| 📋 **Detailed Recipe Cards** | Expandable sections for ingredients, cooking method, chef tips & nutrition |
| ⚡ **Smart Input** | Live ingredient count, quick-add chips (Vegetarian, Quick meals), keyboard shortcuts |
| 💾 **Favorites System** | Save your favorite recipes to local storage |
| 📱 **Fully Responsive** | Looks great on desktop, tablet, and mobile |
| 🔄 **Error Resilience** | Graceful handling of timeouts, network errors, invalid AI responses, and retry |

---

## 🏗️ Architecture

```
┌─────────────────┐     POST /api/generate-recipe     ┌─────────────────┐
│                 │ ──────────────────────────────────► │                 │
│   React + Vite  │                                     │  Express Server │
│   (Frontend)    │ ◄────────────────────────────────── │   (Backend)     │
│                 │         JSON { recipes: [] }        │                 │
└─────────────────┘                                     └────────┬────────┘
                                                                 │
                                                                 ▼
                                                        ┌─────────────────┐
                                                        │   Google Gemini │
                                                        │   AI API        │
                                                        └─────────────────┘
```

---

## 📁 Project Structure

```
FridgeFusion/
├── backend/
│   ├── controllers/        # Request handlers
│   │   └── recipeController.js
│   ├── routes/             # API route definitions
│   │   └── recipeRoutes.js
│   ├── services/           # Gemini AI integration
│   │   └── geminiService.js
│   ├── utils/              # JSON schema validation
│   │   └── validateResponse.js
│   ├── server.js           # Express app entry point
│   └── .env.example        # Environment template
│
├── frontend/
│   ├── public/assets/      # Logo, hero image, video
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── SiteLoader.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── services/
│   │   │   └── api.js      # API client
│   │   ├── App.jsx         # Main application
│   │   ├── index.css       # Complete design system
│   │   └── main.jsx        # React entry point
│   └── vite.config.js
│
├── package.json            # Root scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ 
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### Installation

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Create backend/.env from backend/.env.example and add your Gemini key.
# Create frontend/.env with: VITE_API_URL=http://localhost:5001

# Start both development servers
npm run dev
```

🌐 **Frontend:** http://localhost:5173  
🖥️ **Backend:** http://localhost:5001

To run them separately, use `npm --prefix backend run dev` and `npm --prefix frontend run dev` in two terminals. The production frontend can be built with `npm run build`; the backend can be started with `npm start`.

---

## ⚙️ Environment Variables

| Variable | Location | Required | Description |
|----------|----------|----------|-------------|
| `GEMINI_API_KEY` | `backend/.env` | ✅ | Your Google Gemini API key |
| `GEMINI_MODEL` | `backend/.env` | ❌ | AI model name (default: `gemini-flash-lite-latest`) |
| `CLIENT_URL` | `backend/.env` | ❌ | Allowed frontend URL(s) for CORS |
| `PORT` | `backend/.env` | ❌ | Backend port (default: `5001`) |
| `VITE_API_URL` | `frontend/.env` | ✅ local | Backend base URL, normally `http://localhost:5001` |

---

## 📡 API Reference

### Generate Recipes

```http
POST /api/generate-recipe
Content-Type: application/json
```

**Request Body:**
```json
{
  "ingredients": "Eggs\nMilk\nBread\nCheese"
}
```

**Success Response** `200 OK`:
```json
{
  "recipes": [
    {
      "title": "Chicken Tomato Rice",
      "description": "A simple and tasty meal.",
      "servings": 2,
      "cookingTime": 30,
      "difficulty": "Easy",
      "ingredients": [{ "name": "Chicken", "quantity": 200, "unit": "g" }],
      "steps": ["Chop the vegetables.", "Cook the chicken.", "Add rice and water."],
      "ingredientSwaps": [{ "original": "Chicken", "alternative": "Paneer" }],
      "nutrition": { "calories": 520, "protein": 32, "carbs": 48, "fat": 18 }
    }
  ]
}
```

**Error Responses:**
| Status | Meaning |
|--------|---------|
| `400` | Invalid or missing ingredients |
| `502` | Malformed AI response |
| `504` | AI request timeout |

---

## 🎨 Design System

FridgeFusion uses a custom CSS design system with:

- **Typography:** Playfair Display (headings) + Inter (body)
- **Color Palette:** Forest green tones with amber accents
- **Dark Mode:** Full component-level dark overrides with CSS custom properties
- **Animations:** Framer Motion for page transitions, hover effects, and loading states
- **Glassmorphism:** Frosted glass effects on overlays and navbar

## AI USAGE NOTE

Gemini generates the recipe title, description, ingredients, cooking steps, swaps, and nutrition estimates. The backend requests JSON-only output and validates the nested response shape. The frontend validates it again before rendering interactive components. Nutrition values are AI-generated estimates, not medical or dietary advice.

## KNOWN LIMITATIONS

- Nutrition information is estimated and should be checked for dietary or allergy needs.
- AI-generated recipes may require human judgment, especially for ingredient safety and cooking doneness.
- Gemini availability, model limits, rate limits, and network conditions can affect generation.
- Food photography is selected from a small curated set and may not exactly match each generated recipe.

## TIME SPENT

Development: [fill in actual time]

---

## 🌐 Deployment

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add env variable: `VITE_API_URL` = your Render backend URL

### Backend → Render

1. Create new **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add env variables: `GEMINI_API_KEY`, `CLIENT_URL`

---

## 🛡️ Error Handling Strategy

```
Client Layer          Server Layer           AI Layer
─────────────        ─────────────         ─────────────
• Request IDs        • JSON parsing        • Strict schema
• AbortController    • Schema validation   • Retry logic
• Timeout handling   • Error codes         • Fallback model
• Friendly UI states • CORS protection     • Rate awareness
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Ankit Yadav](https://github.com/officialankit18)**

*Turn your fridge into a recipe book* 🍽️

</div>
