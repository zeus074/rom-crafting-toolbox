
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Assicuriamoci che l'elemento root esista
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div id="root"><h1>Errore di inizializzazione dell\'applicazione</h1><p>Controlla la console per i dettagli.</p></div>';
} else {
  createRoot(rootElement).render(<App />);
}
