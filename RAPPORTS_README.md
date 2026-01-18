# 🗂️ Système de Rapports MDT

## Vue d'ensemble

Le système de rapports permet aux différents services d'urgence (Police, Médecins, Pompiers, etc.) de créer, consulter et partager des rapports de manière organisée.

## Architecture

### Stockage des données
- **Rapports** : Stockés dans `src/components/objects/Rapports.json`
- **Utilisateurs MDT** : Gérés via `MDTUsersManager` avec hashage sécurisé des mots de passe

### Logique d'accès
Un rapport est accessible si :
- ✅ Il a été créé par quelqu'un du même métier
- ✅ **OU** il possède un tag correspondant au métier

## Pages

### 1. Page principale des rapports (`ReportsPage`)
- **Header** : Titre "Rapports" + bouton "+ Créer"
- **Recherche** : Barre de recherche par titre de rapport
- **Liste** : Affichage des rapports avec titre, description tronquée, tags, date

### 2. Page de création (`CreateReportPage`)
- **Layout 2 colonnes** :
  - **Gauche** : Preuves (images), Tags, Description
  - **Droite** : Véhicules, Agents impliqués, Civils, Criminels
- **Header** : Flèche retour, titre éditable, boutons Annuler/Enregistrer

## Utilisation des données

### Création d'un rapport
```typescript
import { Rapport } from '../objects/rapports';

// Créer un nouveau rapport
const newReport = new Rapport(
  Date.now(), // ID
  "Titre du rapport",
  ["url/image1.jpg"], // Images
  ["ABC-123"], // Véhicules
  ["police", "urgence"], // Tags
  ["Agent Smith"], // Agents
  "Description détaillée...",
  ["Jean Dupont"], // Civils
  ["Marie Dubois"] // Criminels
  "lspd" // Métier créateur
);
```

### Récupération des rapports
```typescript
// Pour la police (lspd)
const rapportsPolice = Rapport.getAllReports('lspd');

// Pour les médecins (lspdh) - verront aussi les rapports tagués "lspdh"
const rapportsMedecins = Rapport.getAllReports('lspdh');
```

## Gestion des utilisateurs

### Authentification
```typescript
import { MDTUsersManager } from '../objects/users';

// Connexion
const user = await MDTUsersManager.authenticate('agent.smith', 'password');

// Création d'utilisateur
await MDTUsersManager.createUser({
  username: 'new.agent',
  password: 'securePassword123',
  job: 'lspd',
  grade: 2,
  name: 'New Agent',
  badge: '12346'
});
```

## Sécurité

- **Mots de passe** : Hashés avec bcrypt (10 rounds)
- **Accès aux rapports** : Filtrage automatique selon métier + tags
- **Données sensibles** : Mots de passe jamais exposés côté client

## Exemple de données

Voir `Rapports.json` pour des exemples complets de rapports avec différents tags et métiers.