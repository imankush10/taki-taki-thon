# Metal LCA Analysis Tool

A modern web application for conducting Life Cycle Assessment (LCA) analysis on metal products, enhanced with AI-powered insights.

## Features

- **Interactive LCA Wizard**: Step-by-step guidance for LCA data collection
- **Real-time Visualizations**: Charts and graphs powered by Chart.js
- **AI-Powered Insights**: Google Gemini integration for intelligent analysis
- **Modern UI**: Built with Next.js 15, React 19, and TailwindCSS
- **State Management**: Zustand for centralized data management

## Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Google Gemini API key: `GOOGLE_GEMINI_API_KEY=your_key_here`
4. Run the development server: `pnpm dev`

## 🎬 Scroll Canvas Animation

The landing page features a smooth scroll-based canvas animation that plays through frame-by-frame images as the user scrolls. The animation serves as a fixed background with a subtle black overlay for optimal readability.

### Current Setup (Optimized)

- **Frame Count**: 140 optimized frames
- **Format**: JPG (compressed for faster loading)
- **Naming**: `frame0001.jpg`, `frame0002.jpg`, etc.
- **Location**: `/public/frames/`

### Adding Your Own Images

1. **Prepare your images:**

   - Name them sequentially: `frame0001.jpg`, `frame0002.jpg`, etc.
   - Recommended resolution: 1920x1080 or similar 16:9 aspect ratio
   - Compress for web to optimize loading speed

2. **Update configuration in `app/page.js`:**
   ```javascript
   <ScrollCanvas
     imageCount={140} // Your total number of frames
     imagePath="/frames/frame" // Path prefix (no underscore)
     imageExtension=".jpg" // Your image format
     useGeneratedFrames={false} // Use actual images
     className="w-full h-full"
   />
   ```

## 🎨 Scroll Animation Features

- **Smooth Performance**: Images are preloaded for seamless scrolling
- **Responsive Design**: Automatically scales to fit different screen sizes
- **Loading Progress**: Shows loading indicator while frames are being prepared
- **Fallback System**: Generates placeholder frames if images fail to load
- **Optimized Rendering**: Only renders frames as needed during scroll

## 🔧 Customization Options

- `imageCount`: Number of frames in your animation
- `imagePath`: Base path to your image files
- `imageExtension`: File extension (`.jpg`, `.png`, etc.)
- `useGeneratedFrames`: Whether to use generated demo frames
- `className`: Additional CSS classes for styling

## Google Gemini AI Integration

This application uses Google Gemini AI (gemini-1.5-flash model) to provide:

- Intelligent environmental impact analysis
- Personalized sustainability recommendations
- Quick optimization tips during the LCA process

To get a Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
