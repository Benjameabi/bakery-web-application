import { useState, useEffect } from 'react';
import { masterJacobsAPI, I18nTranslations } from '../lib/api';

interface SwedishTexts {
  // Allergen information
  allergens: Record<string, string>;
  
  // Cake builder interface
  cakeBuilder: {
    sizeHelpText: string;
    sizeTitle: string;
    variantTitle: string;
    allergensLabels: Record<string, string>;
  };
  
  // Common UI elements
  titles: Record<string, string>;
  
  // Loading state
  isLoading: boolean;
}

export function useSwedishI18n() {
  const [swedishTexts, setSwedishTexts] = useState<SwedishTexts>({
    allergens: {},
    cakeBuilder: {
      sizeHelpText: 'Hur många tårtbitar behöver man? Ett förslag är att beräkna 1,5 bit per person.',
      sizeTitle: 'Välj storlek',
      variantTitle: 'Välj smak/fyllning',
      allergensLabels: {}
    },
    titles: {},
    isLoading: true
  });

  useEffect(() => {
    loadSwedishTranslations();
  }, []);

  const loadSwedishTranslations = async () => {
    try {
      // Load main translations
      const translations = await masterJacobsAPI.getTranslations('main');
      
      // Load allergen information
      const allergens = await masterJacobsAPI.getAllergenInfo();
      
      // Load cake builder texts
      const cakeBuilder = await masterJacobsAPI.getCakeBuilderTexts();
      
      setSwedishTexts({
        allergens,
        cakeBuilder: {
          sizeHelpText: cakeBuilder.cakeSizesSection?.helpText || swedishTexts.cakeBuilder.sizeHelpText,
          sizeTitle: cakeBuilder.cakeSizesSection?.title || swedishTexts.cakeBuilder.sizeTitle,
          variantTitle: cakeBuilder.cakeVariantsSection?.title || swedishTexts.cakeBuilder.variantTitle,
          allergensLabels: cakeBuilder.allergensStateLabels || {}
        },
        titles: translations.titles || {},
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading Swedish translations:', error);
      setSwedishTexts(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Helper functions for common translations
  const getAllergenText = (allergen: string): string => {
    return swedishTexts.allergens[allergen] || allergen;
  };

  const getTitle = (key: string): string => {
    return swedishTexts.titles[key] || key;
  };

  // Common Swedish bakery terms
  const bakeryTerms = {
    // Product categories
    tartor: 'Tårtor',
    bakelser: 'Bakelser',
    matbrod: 'Matbröd',
    bullar: 'Bullar',
    frukost: 'Frukost',
    fika: 'Fika',
    
    // Order terms
    bestall: 'Beställ',
    leverans: 'Leverans',
    hamtning: 'Hämtning',
    laggtillvara: 'Lägg till i varukorg',
    totalt: 'Totalt',
    moms: 'Inkl. moms',
    
    // Time and delivery
    leveranstid: 'Leveranstid',
    oppettider: 'Öppettider',
    stangd: 'Stängd',
    frifrakt: 'Fri frakt',
    leveransavgift: 'Leveransavgift',
    
    // Quality descriptors
    nybakat: 'Nybakat',
    farskt: 'Färskt',
    hemlagat: 'Hemlagat',
    ekologiskt: 'Ekologiskt',
    
    // Contact and location
    telefon: 'Telefon',
    adress: 'Adress',
    epost: 'E-post',
    kontakt: 'Kontakta oss',
    
    // Actions
    sok: 'Sök',
    bestallning: 'Beställning',
    bekrafta: 'Bekräfta',
    avbryt: 'Avbryt',
    andra: 'Ändra',
    rensa: 'Rensa'
  };

  return {
    ...swedishTexts,
    getAllergenText,
    getTitle,
    bakeryTerms,
    reloadTranslations: loadSwedishTranslations
  };
}

// Export commonly used Swedish texts for static usage
export const SWEDISH_CONSTANTS = {
  CURRENCY: 'kr',
  PHONE_PREFIX: '+46',
  COUNTRY: 'Sverige',
  CITY: 'Västerås',
  
  // Days of the week
  DAYS: {
    monday: 'Måndag',
    tuesday: 'Tisdag', 
    wednesday: 'Onsdag',
    thursday: 'Torsdag',
    friday: 'Fredag',
    saturday: 'Lördag',
    sunday: 'Söndag'
  },
  
  // Months
  MONTHS: {
    january: 'Januari',
    february: 'Februari',
    march: 'Mars',
    april: 'April',
    may: 'Maj',
    june: 'Juni',
    july: 'Juli',
    august: 'Augusti',
    september: 'September',
    october: 'Oktober',
    november: 'November',
    december: 'December'
  }
} as const;
