import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import '../styles/performance.css'
import App from './App.jsx'

// Preload critical resources
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Preload critical images
    const criticalImages = [
      '/src/assets/images/hero-laddus.png',
      '/src/assets/images/besan-laddu.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)