
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definizione dei tipi per le lingue supportate
export type Language = 'it' | 'en';

// Interfaccia del contesto per la lingua
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Traduzioni per ciascuna lingua
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'ROM Creator',
    'app.description': 'Create and manage ROM binary files',
    'project.settings': 'Project Settings',
    'project.name': 'Project Name',
    'project.name.placeholder': 'Enter project name',
    'rom.type': 'ROM Type',
    'fill.pattern': 'Fill Pattern',
    'zeros': 'Zeros',
    'ones': 'Ones',
    'add.rom.files': 'Add ROM Files',
    'export.rom': 'Export ROM',
    'rom.segments': 'ROM Segments',
    'rom.content.viewer': 'ROM Content Viewer',
    'no.segment.selected': 'No segment selected',
    'select.segment': 'Select a segment from the list to view its contents',
    'load': 'Load',
    'save': 'Save',
    'reset': 'Reset',
    'language': 'Language',
  },
  it: {
    'app.title': 'ROM Creator',
    'app.description': 'Crea e gestisci file binari ROM',
    'project.settings': 'Impostazioni Progetto',
    'project.name': 'Nome Progetto',
    'project.name.placeholder': 'Inserisci nome progetto',
    'rom.type': 'Tipo ROM',
    'fill.pattern': 'Pattern Riempimento',
    'zeros': 'Zeri',
    'ones': 'Uni',
    'add.rom.files': 'Aggiungi File ROM',
    'export.rom': 'Esporta ROM',
    'rom.segments': 'Segmenti ROM',
    'rom.content.viewer': 'Visualizzatore Contenuto ROM',
    'no.segment.selected': 'Nessun segmento selezionato',
    'select.segment': 'Seleziona un segmento dalla lista per visualizzare il contenuto',
    'load': 'Carica',
    'save': 'Salva',
    'reset': 'Reimposta',
    'language': 'Lingua',
  }
};

// Creazione del contesto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider del contesto
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Rileva la lingua del browser o usa l'italiano come predefinito
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'it' ? 'it' : 'en';
  };

  const [language, setLanguage] = useState<Language>(() => {
    // Controlla se la lingua è stata salvata in precedenza
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || getBrowserLanguage();
  });

  // Funzione per ottenere una traduzione
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Salva la lingua scelta nel localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook per utilizzare il contesto della lingua
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
