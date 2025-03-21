
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
    'ones': '255',
	'rom.usage': 'ROM Usage',
	'usage': 'Usage',
	'used': 'Used',
	'free': 'Free',
	'total': 'Total',
	'roms.required': 'ROMs Required',
    'add.rom.files': 'Add ROM Files',
    'export.rom': 'Export ROM',
	'add.blank.space': 'Add Blank Space',
	'size': 'Size',
	'select.size': 'Select Size',
    'rom.segments': 'ROM Segments',
	'no.rom.added': 'No ROM segments added yet',
	'no.rom.added.descri': 'Use the buttons above to add ROM files or blank space',
    'rom.content.viewer': 'ROM Content Viewer',
    'no.segment.selected': 'No segment selected',
    'select.segment': 'Select a ROM from the list to view its contents',
    'load': 'Load',
    'save': 'Save',
    'reset': 'Reset',
    'language': 'Language',
	'err.loading.rom': 'Error loading ROM files:',
	'failed.load.rom': 'Failed to load ROM files',
	'segment.removed': 'Segment removed',
	'no.data.export': 'No data to export',
	'export.success': 'ROM file exported successfully',
	'error.export.rom': 'Error exporting ROM:',
    'failed.export.rom': 'Failed to export ROM files',
	'project.saved': 'Project saved successfully',
	'error.project.save': 'Error saving project:',
	'failed.project.save': 'Failed to save project',
	'delete.confirm': 'Are you sure you want to reset the project? All unsaved changes will be lost.',
  it: {
    'app.title': 'ROM Creator',
    'app.description': 'Crea e gestisci file immagine delle ROM',
    'project.settings': 'Impostazioni Progetto',
    'project.name': 'Nome Progetto',
    'project.name.placeholder': 'Inserisci nome progetto',
    'rom.type': 'Tipo ROM',
    'fill.pattern': 'Pattern Riempimento',
    'zeros': 'Zero',
    'ones': '255',
	'rom.usage': 'Spazio della ROM',
	'usage': 'Utilizzo',
	'used': 'Usato',
	'free': 'Libero',
	'total': 'Totale',
	'roms.required': 'ROM Richieste',
    'add.rom.files': 'Aggiungi File ROM',
    'export.rom': 'Esporta ROM',
	'add.blank.space': 'Aggiungi spazio vuoto',
	'size': 'Grandezza',
	'select.size': 'Seleziona Grandezza',
    'rom.segments': 'ROM Caricate',
	'no.rom.added': 'Nessuna ROM ancora caricata',
	'no.rom.added.descri': 'Usa i pulsanti sopra per aggiungere un file o uno spazio vuoto',
    'rom.content.viewer': 'Contenuto della ROM',
    'no.segment.selected': 'Nessun segmento selezionato',
    'select.segment': 'Seleziona uns ROM dalla lista per visualizzare il contenuto',
    'load': 'Carica',
    'save': 'Salva',
    'reset': 'Reimposta',
    'language': 'Lingua',
	'err.loading.rom': 'Errore caricamento file ROM:',
	'failed.load.rom': 'Impossibile caricare i file ROM',
	'segment.removed': 'ROM rimossa',
	'no.data.export': 'Nessun dato da esportare',
	'export.success': 'ROM esportata con successo',
	'error.export.rom': 'Errore esporazione ROM:',
    'failed.export.rom': 'Impossibile esportare la ROM',
	'project.saved': 'Progetto salvato',
	'error.project.save': 'Errore nel salvataggio progetto:',
	'failed.project.save': 'impossibile salvare il progetto',
	'delete.confirm': 'Sicuro di voler resettare il progetto? Le modifiche non salvate verranno perse.',
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
