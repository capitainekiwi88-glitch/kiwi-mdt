import lspdLogo from "../components/logo/lspdlogo.png";
import lsdphLogo from "../components/logo/lsdphlogo.webp";
import fibLogo from "../components/logo/fiblogo.webp";
import mayorLogo from "../components/logo/mayorlogo.webp";
import lsfdLogo from "../components/logo/lsfdlogo.webp";
import dojLogo from "../components/logo/dojlogo.png";

// Configuration des services et leurs tags prédéfinis
export const SERVICE_CONFIG = {
  lspd: {
    name: 'Los Santos Police Department',
    logo: lspdLogo,
    color: '#1e40af', // bleu police
    availableTags: [
      'LSPD',
      'LSFD',
      'LSDPH', 
      'FIB',
      'DOJ',
      'Mairie',
      'Crime financiers',
      'Délit majeur',
      'Délit mineur',
      'Infractions'
    ],
    hasReports: true,
    hasWarrants: true,
    hasPenalties: true
  },
  lsdph: {
    name: 'Los Santos Department of Public Health',
    logo: lsdphLogo,
    color: '#059669', // vert médical
    availableTags: [
      'LSDPH',
      'LSPD',
      'LSFD',
      'Medical Emergency',
      'Patient Treatment',
      'Surgery',
      'Mental Health',
      'Drug Abuse',
      'Autopsy',
      'Medical Report',
      'Quarantine',
      'Vaccination'
    ],
    hasReports: true,
    hasWarrants: false,
    hasPenalties: false
  },
  fib: {
    name: 'Federal Investigation Bureau',
    logo: fibLogo,
    color: '#7c3aed', // violet FBI
    availableTags: [
      'FIB',
      'LSPD',
      'DOJ',
      'Federal Crime',
      'Organized Crime',
      'Terrorism',
      'Corruption',
      'Money Laundering',
      'Cybercrime',
      'Undercover',
      'Classified',
      'High Priority',
      'Federal Warrant'
    ],
    hasReports: true,
    hasWarrants: true,
    hasPenalties: true
  },
  mairie: {
    name: 'Mairie de Los Santos',
    logo: mayorLogo,
    color: '#dc2626', // rouge maire
    availableTags: [
      'Mayor',
      'LSPD',
      'DOJ',
      'LSFD',
      'LSDPH',
      'FIB',
      'Administrative',
      'Public Order',
      'City Planning',
      'Budget',
      'Public Event',
      'City Council'
    ],
    hasReports: false,
    hasWarrants: true,
    hasPenalties: true
  },
  lsfd: {
    name: 'Los Santos Fire Department',
    logo: lsfdLogo,
    color: '#dc2626', // rouge pompiers
    availableTags: [
      'LSFD',
      'LSPD',
      'LSDPH',
      'Fire',
      'Rescue',
      'Medical Emergency',
      'Hazmat',
      'Vehicle Accident',
      'Building Collapse',
      'Natural Disaster',
      'Fire Investigation'
    ],
    hasReports: true,
    hasWarrants: true,
    hasPenalties: false
  },
  doj: {
    name: 'Department of Justice',
    logo: dojLogo,
    color: '#92400e', // marron justice
    availableTags: [
      'DOJ',
      'LSPD',
      'FIB',
      'Mayor',
      'Court Order',
      'Legal Procedure',
      'Warrant',
      'Sentencing',
      'Appeal',
      'Legal Opinion',
      'Constitutional Matter'
    ],
    hasReports: true,
    hasWarrants: true,
    hasPenalties: true
  }
};

export type ServiceKey = keyof typeof SERVICE_CONFIG;

/**
 * Récupère les tags disponibles pour un service
 */
export function getAvailableTags(service: ServiceKey): string[] {
  return SERVICE_CONFIG[service]?.availableTags || [];
}

/**
 * Récupère la configuration d'un service
 */
export function getServiceConfig(service: ServiceKey) {
  return SERVICE_CONFIG[service];
}

/**
 * Vérifie si un service a accès à une fonctionnalité
 */
export function hasFeature(service: ServiceKey, feature: 'reports' | 'warrants' | 'penalties'): boolean {
  const config = SERVICE_CONFIG[service];
  if (!config) return false;
  
  switch (feature) {
    case 'reports':
      return config.hasReports;
    case 'warrants':
      return config.hasWarrants;
    case 'penalties':
      return config.hasPenalties;
    default:
      return false;
  }
}
