// [Commit 35/70] CI: Update CI/CD pipeline
// [Commit 15/70] FEATURE: Add caching for property listings
// [Commit 12/70] FEATURE: Enhance notification system
// [Commit 9/70] STYLE: Standardize naming conventions
// [Commit 8/70] STYLE: Standardize naming conventions
# Confidential Appart

Plateforme intelligente de gestion immobilière — achetez, vendez et gérez vos biens en toute confiance.

## Stack technique

| Côté | Technologie |
|------|-------------|
| Frontend | Angular 19 + Ionic 8 + Tailwind CSS 4 |
| Backend | Fastify (Node.js) |
| Base de données | MongoDB (Mongoose) |
| Temps réel | WebSocket |
| Cartes | Leaflet + OpenStreetMap |
| Auth | JWT + Google OAuth |

---

## Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- Un compte **MongoDB Atlas** (gratuit) : [cloud.mongodb.com](https://cloud.mongodb.com)

---

## Installation

### 1. Cloner le projet

```bash
git clone git@github.com:Prince-Elie/confidential-appart.git
cd confidential-appart
```

### 2. Backend

```bash
cd backend-fastify
npm install
```

Créez le fichier `.env` à partir du modèle :

```bash
cp .env.example .env
```

Remplissez les variables dans `.env` :

```env
PORT=8000
LOGGER=true
SALT=12
SECRET_KEY='votre_secret_jwt'
DB_CONNECT=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/confidential-appart?appName=Cluster0
USER_ACTIVITIES_MAX=20
USER_NOTIFICATIONS_MAX=30
```

> **Important** : Sur MongoDB Atlas, allez dans **Network Access** → **Add IP Address** pour autoriser votre IP.

Démarrez le serveur :

```bash
npm run dev        # développement (nodemon)
npm start          # production
```

Le backend tourne sur `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

L'application est disponible sur `http://localhost:4200`.

---

## Fonctionnalités

- **Carte interactive** — visualisez tous les biens sur une carte Leaflet, filtrez par type, mesurez les distances
- **Annonces** — créez, modifiez et supprimez vos propriétés avec galerie photo
- **Recherche avancée** — filtrez par prix, type, localisation
- **Messagerie / Enquêtes** — contactez directement vendeurs et acheteurs
- **Calculateur hypothécaire** — simulez vos mensualités avec graphiques
- **Profil utilisateur** — historique d'activité, notifications en temps réel
- **Mode sombre** — thème clair/sombre persistant
- **Responsive** — mobile, tablette, desktop

---

## Structure du projet

```
confidential-appart/
├── frontend/          # Application Angular + Ionic
│   └── src/
│       ├── app/
│       │   ├── about/          # Page d'accueil publique
│       │   ├── map/            # Vue cartographique
│       │   ├── properties/     # Gestion des biens
│       │   ├── enquiries/      # Messagerie
│       │   ├── mortgage-calc/  # Calculateur
│       │   ├── user/           # Auth + profil
│       │   └── shared/         # Composants réutilisables
│       └── assets/
└── backend-fastify/   # API REST Fastify
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        └── services/
```

---

## Variables d'environnement (backend)

| Variable | Description | Requis |
|----------|-------------|--------|
| `PORT` | Port du serveur | Oui |
| `SECRET_KEY` | Clé secrète JWT | Oui |
| `DB_CONNECT` | URI MongoDB Atlas | Oui |
| `SALT` | Rounds bcrypt | Oui |
| `GOOGLE_AUTH_CLIENT_ID` | ID client Google OAuth | Non |

---

## Scripts disponibles

### Frontend
```bash
npm start          # Serveur de développement
npm run build      # Build production
npm test           # Tests unitaires
npm run tailwind:watch  # Recompile Tailwind en temps réel
```

### Backend
```bash
npm run dev        # Développement avec rechargement auto
npm start          # Production
npm run db:seeder  # Peupler la base de données
```
