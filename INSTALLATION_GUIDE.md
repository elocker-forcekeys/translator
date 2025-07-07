# 📚 Guide d'Installation TranslateAI

## 🌐 Informations Générales

- **Domaine Frontend** : https://translate.forcekeys.com
- **API Backend** : https://translate.forcekeys.com/api/v1
- **Serveur de Traduction** : https://translateapi.forcekeys.com/translate
- **Base de Données** : MySQL sur 91.234.194.20

---

## 🎯 Architecture de l'Application

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  Translation    │
│   React/Vite    │◄──►│   Node.js       │◄──►│   Service       │
│   Port: 3000    │    │   Port: 5000    │    │   External API  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │   MySQL DB      │
         │              │   91.234.194.20 │
         │              └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Static Files  │
│   Nginx/CDN     │
└─────────────────┘
```

---

## 🚀 Installation Frontend (React + Vite)

### 📋 Prérequis
- **Node.js** : v18.0.0 ou supérieur
- **npm** : v8.0.0 ou supérieur
- **Git** : Dernière version

### 🔧 Versions des Outils
```json
{
  "node": ">=18.0.0",
  "npm": ">=8.0.0",
  "vite": "^5.4.2",
  "react": "^18.3.1",
  "typescript": "^5.5.3",
  "tailwindcss": "^3.4.1"
}
```

### 📦 Installation
```bash
# 1. Cloner le repository
git clone https://github.com/votre-repo/translateai-frontend.git
cd translateai-frontend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de configuration
cp .env.example .env.local

# 4. Configurer les variables d'environnement
nano .env.local
```

### 🔐 Variables d'Environnement Frontend
```env
# .env.local
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_TRANSLATION_API_URL=https://translateapi.forcekeys.com/translate
VITE_APP_NAME=TranslateAI
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
```

### 🏗️ Build et Déploiement
```bash
# Développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Tests (si configurés)
npm run test
```

### 📁 Structure Frontend
```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx
│   ├── TranslationTool.tsx
│   └── LanguageSelector.tsx
├── pages/              # Pages de l'application
│   ├── HomePage.tsx
│   ├── Dashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── PricingPage.tsx
│   ├── ApiDocsPage.tsx
│   └── ProfilePage.tsx
├── contexts/           # Contextes React
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── services/           # Services API
│   └── api.ts
├── config/             # Configuration
│   └── api.ts
├── i18n/              # Internationalisation
│   └── translations.ts
├── hooks/             # Hooks personnalisés
├── utils/             # Utilitaires
├── types/             # Types TypeScript
└── App.tsx            # Composant principal
```

---

## 🖥️ Installation Backend (Node.js + Express)

### 📋 Prérequis
- **Node.js** : v18.0.0 ou supérieur
- **npm** : v8.0.0 ou supérieur
- **MySQL** : v8.0 ou supérieur
- **Redis** : v6.0 ou supérieur (optionnel, pour le cache)

### 🔧 Versions des Outils Backend
```json
{
  "node": ">=18.0.0",
  "express": "^4.18.2",
  "typescript": "^5.0.0",
  "mysql2": "^3.6.0",
  "prisma": "^5.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "multer": "^1.4.5",
  "sharp": "^0.32.0",
  "pdf-parse": "^1.1.1",
  "tesseract.js": "^4.1.0",
  "stripe": "^12.0.0",
  "nodemailer": "^6.9.0",
  "helmet": "^7.0.0",
  "cors": "^2.8.5",
  "rate-limiter-flexible": "^2.4.1"
}
```

### 📦 Installation Backend
```bash
# 1. Utiliser l'exemple backend fourni
cd backend-example

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
nano .env

# 4. Démarrer le serveur
npm run dev
```

### 🔐 Variables d'Environnement Backend
```env
# .env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://translate.forcekeys.com

# Base de données
DB_HOST=91.234.194.20
DB_USER=cp2111737p21_translate
DB_PASSWORD=2J)ewo=OuYQk
DB_NAME=cp2111737p21_translate
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# API de traduction
TRANSLATION_API_URL=https://translateapi.forcekeys.com/translate
DEEPL_API_KEY=your_deepl_api_key_here
GOOGLE_TRANSLATE_API_KEY=your_google_api_key_here

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Stockage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=txt,pdf,jpg,jpeg,png,gif,webp

# Sécurité
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Redis (optionnel)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info
```

### 📁 Structure Backend
```
src/
├── controllers/        # Contrôleurs
│   ├── authController.ts
│   ├── translationController.ts
│   ├── userController.ts
│   ├── adminController.ts
│   └── billingController.ts
├── middleware/         # Middlewares
│   ├── auth.ts
│   ├── validation.ts
│   ├── rateLimit.ts
│   ├── upload.ts
│   └── errorHandler.ts
├── models/            # Modèles de données
│   ├── User.ts
│   ├── Translation.ts
│   ├── Subscription.ts
│   └── Payment.ts
├── routes/            # Routes API
│   ├── auth.ts
│   ├── translation.ts
│   ├── user.ts
│   ├── admin.ts
│   └── billing.ts
├── services/          # Services métier
│   ├── translationService.ts
│   ├── ocrService.ts
│   ├── pdfService.ts
│   ├── emailService.ts
│   ├── stripeService.ts
│   └── fileService.ts
├── utils/             # Utilitaires
│   ├── database.ts
│   ├── logger.ts
│   ├── validation.ts
│   └── helpers.ts
├── types/             # Types TypeScript
│   └── index.ts
└── app.ts             # Application principale
```

### 🗄️ Configuration Prisma
```bash
# Initialiser Prisma
npx prisma init

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push
```

---

## 🗄️ Installation Base de Données

### 📍 Emplacement du Script
Le script de création se trouve dans : `supabase/migrations/20250705114206_dawn_tree.sql`

### 🔧 Paramètres de Connexion MySQL
```
Serveur: 91.234.194.20
Utilisateur: cp2111737p21_translate
Mot de passe: 2J)ewo=OuYQk
Base de données: cp2111737p21_translate
Port: 3306
```

### 🚀 Installation de la Base de Données
```bash
# Via MySQL Command Line
mysql -h 91.234.194.20 -u cp2111737p21_translate -p cp2111737p21_translate < supabase/migrations/20250705114206_dawn_tree.sql

# Ou via phpMyAdmin/MySQL Workbench
# Copiez-collez le contenu du fichier SQL et exécutez-le
```

### 📊 Tables Créées
1. **users** - Utilisateurs et authentification
2. **translations** - Historique des traductions
3. **subscriptions** - Gestion des abonnements
4. **payments** - Facturation Stripe
5. **supported_languages** - 200+ langues supportées
6. **usage_stats** - Statistiques d'utilisation
7. **api_logs** - Logs des appels API
8. **system_settings** - Configuration système
9. **user_sessions** - Gestion des sessions
10. **uploaded_files** - Fichiers uploadés

### 🔐 Compte Admin par Défaut
- **Email** : `admin@translate.forcekeys.com`
- **Mot de passe** : `admin123`
- **Rôle** : Administrateur

---

## 🔧 Backend Exemple Fourni

Le projet inclut un backend d'exemple fonctionnel dans le dossier `backend-example/` avec :

### Fonctionnalités implémentées
- ✅ **Authentification** : Login/Register avec JWT
- ✅ **Connexion MySQL** : Utilise la vraie base de données
- ✅ **Hachage des mots de passe** : Bcrypt sécurisé
- ✅ **Middleware d'auth** : Protection des routes
- ✅ **CORS configuré** : Pour le frontend
- ✅ **Gestion d'erreurs** : Réponses structurées

### Démarrage rapide
```bash
cd backend-example
npm install
cp .env.example .env
# Modifier .env si nécessaire
npm run dev
```

### Test de l'API
```bash
# Test de connexion admin
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@translate.forcekeys.com","password":"admin123"}'
```

## 🌐 Déploiement Production

### 🔧 Nginx Configuration
```nginx
# /etc/nginx/sites-available/translate.forcekeys.com
server {
    listen 80;
    server_name translate.forcekeys.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name translate.forcekeys.com;

    ssl_certificate /etc/letsencrypt/live/translate.forcekeys.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/translate.forcekeys.com/privkey.pem;

    # Frontend (React build)
    location / {
        root /var/www/translateai/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    client_max_body_size 10M;
}
```

### 🔄 PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'translateai-backend',
    script: 'dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 🚀 Scripts de Déploiement
```bash
#!/bin/bash
# deploy.sh

# Frontend
echo "Building frontend..."
cd /var/www/translateai
git pull origin main
npm ci
npm run build

# Backend
echo "Deploying backend..."
cd /var/www/translateai-backend
git pull origin main
npm ci
npm run build
pm2 restart translateai-backend

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "Deployment completed!"
```

---

## 🔄 Mode Développement vs Production

### Développement Local
- **Frontend** : `npm run dev` (port 5173)
- **Backend** : `npm run dev` (port 5000)
- **Base de données** : MySQL distant (91.234.194.20)
- **API de traduction** : Service externe

### Production
- **Frontend** : Build statique servi par Nginx
- **Backend** : PM2 + Nginx reverse proxy
- **Base de données** : Même serveur MySQL
- **SSL** : Let's Encrypt obligatoire

## 🎛️ Fonctionnalités Implémentées

### 🔧 Authentification Réelle
- **Connexion sécurisée** : Vérification en base de données
- **Hachage bcrypt** : Mots de passe sécurisés
- **JWT tokens** : Sessions persistantes
- **Middleware d'auth** : Protection des routes
- **Gestion d'erreurs** : Messages explicites

### 🎯 Comptes de Test Disponibles
```
Admin : admin@translate.forcekeys.com / admin123
```

### 🔄 Fallback Mode
Si le backend n'est pas disponible, le frontend utilise un mode simulation avec des comptes de test prédéfinis.

### 👤 Dashboard Utilisateur

#### 📊 Vue d'ensemble
- **Statistiques personnelles** : Mots traduits, documents traités, économies estimées
- **Utilisation du plan** : Barre de progression avec limite de mots
- **Traductions récentes** : Historique avec possibilité de retraduire
- **Métriques mensuelles** : Graphiques d'utilisation

#### 🔧 Outil de Traduction
- **Traduction de texte** : Interface intuitive avec 200+ langues
- **Upload de fichiers** : Support TXT, PDF, images (OCR)
- **Échange de langues** : Bouton pour inverser source/cible
- **Copie rapide** : Bouton de copie avec feedback visuel
- **Compteur en temps réel** : Caractères et mots
- **Barre de progression** : Upload de fichiers avec pourcentage

#### 📈 Historique
- **Liste complète** : Toutes les traductions avec filtres
- **Détails de traduction** : Langues, date, type de fichier
- **Actions rapides** : Retraduire, télécharger, supprimer
- **Recherche** : Filtrage par texte, langue, date

#### 🔑 Gestion API
- **Clé API personnelle** : Génération et régénération
- **Statistiques d'utilisation** : Requêtes, latence, taux de succès
- **Documentation intégrée** : Exemples de code
- **Limites de taux** : Affichage des quotas

#### 💳 Facturation
- **Plan actuel** : Détails et limites
- **Historique des paiements** : Factures et reçus
- **Changement de plan** : Upgrade/downgrade
- **Méthodes de paiement** : Gestion des cartes

#### ⚙️ Profil
- **Informations personnelles** : Nom, email, mot de passe
- **Préférences** : Langue, notifications, fuseau horaire
- **Sécurité** : 2FA, sessions actives
- **Paramètres API** : Clés et permissions

### 👨‍💼 Dashboard Administrateur

#### 📊 Vue d'ensemble
- **Métriques globales** : Utilisateurs totaux, traductions du jour, revenus
- **Graphiques en temps réel** : Évolution des inscriptions et utilisation
- **État du système** : Statut des services (API, OCR, PDF)
- **Activité récente** : Logs des actions importantes

#### 👥 Gestion des Utilisateurs
- **Liste complète** : Tous les utilisateurs avec filtres
- **Détails utilisateur** : Profil, utilisation, historique
- **Actions administratives** : Suspendre, activer, changer de plan
- **Recherche avancée** : Par email, plan, date d'inscription
- **Export de données** : CSV, Excel

#### 🔧 Gestion API
- **Performance globale** : Latence moyenne, taux d'erreur
- **Endpoints populaires** : Statistiques par route
- **Monitoring en temps réel** : Requêtes actives
- **Logs détaillés** : Erreurs et exceptions
- **Alertes** : Notifications de problèmes

#### 💰 Facturation et Revenus
- **Revenus mensuels** : Graphiques et tendances
- **Abonnements actifs** : Répartition par plan
- **Taux de conversion** : Freemium vers payant
- **Churn rate** : Taux d'annulation
- **Prévisions** : Projections de revenus

#### ⚙️ Paramètres Système
- **Configuration globale** : Limites, quotas, fonctionnalités
- **Mode maintenance** : Activation/désactivation
- **Gestion des langues** : Ajout/suppression de langues
- **Paramètres de sécurité** : Politiques de mots de passe
- **Intégrations** : Configuration des services externes

#### 📈 Analytics et Rapports
- **Tableaux de bord personnalisés** : Métriques importantes
- **Rapports automatisés** : Envoi par email
- **Analyse des tendances** : Utilisation par période
- **Segmentation utilisateurs** : Comportements et patterns
- **Export de données** : Rapports détaillés

### 🌍 Fonctionnalités Multilingues

#### 🔄 Système de Traduction
- **3 langues d'interface** : Anglais (EN), Français (FR), Arabe (AR)
- **Détection automatique** : Langue du navigateur
- **Persistance** : Sauvegarde du choix utilisateur
- **RTL Support** : Interface adaptée pour l'arabe
- **Traductions complètes** : Tous les textes de l'interface

#### 🎨 Adaptations Visuelles
- **Direction du texte** : LTR/RTL automatique
- **Polices adaptées** : Support des caractères spéciaux
- **Mise en page responsive** : Adaptation selon la langue
- **Icônes et drapeaux** : Représentation visuelle des langues

---

## 🚨 Points d'Attention

### Sécurité
- ⚠️ **Changez le mot de passe admin** par défaut en production
- ⚠️ **Configurez un JWT_SECRET** fort en production
- ⚠️ **Activez HTTPS** obligatoirement en production
- ⚠️ **Limitez l'accès MySQL** aux IPs autorisées

### Performance
- 📊 **Surveillez les connexions MySQL** (limite de connexions)
- 📊 **Configurez un pool de connexions** pour la production
- 📊 **Activez la compression** Nginx
- 📊 **Utilisez un CDN** pour les assets statiques

### Monitoring
- 🔍 **Logs applicatifs** : Winston + rotation
- 🔍 **Métriques système** : CPU, RAM, disque
- 🔍 **Monitoring MySQL** : Requêtes lentes, connexions
- 🔍 **Alertes** : Email/SMS en cas de problème

## 🔧 Maintenance et Monitoring

### 📊 Métriques à Surveiller
- **Performance API** : Temps de réponse, taux d'erreur
- **Utilisation base de données** : Connexions, requêtes lentes
- **Espace disque** : Fichiers uploadés, logs
- **Mémoire et CPU** : Utilisation serveur
- **Trafic réseau** : Bande passante

### 🔄 Tâches de Maintenance
- **Sauvegarde quotidienne** : Base de données et fichiers
- **Nettoyage des logs** : Rotation automatique
- **Mise à jour sécurité** : Patches réguliers
- **Monitoring des certificats SSL** : Renouvellement automatique
- **Tests de performance** : Benchmarks réguliers

### 🚨 Alertes Configurées
- **Erreurs 5xx** : Notification immédiate
- **Latence élevée** : Seuil de 2 secondes
- **Espace disque** : Alerte à 80%
- **Échecs de paiement** : Notification Stripe
- **Tentatives de piratage** : Logs de sécurité

---

## 📞 Support et Documentation

### 🔗 Liens Utiles
- **Documentation API** : https://translate.forcekeys.com/api-docs
- **Status Page** : https://status.translate.forcekeys.com
- **Support** : support@translate.forcekeys.com
- **GitHub** : https://github.com/votre-org/translateai

### 🆘 Dépannage
1. **Vérifier les logs** : `tail -f logs/app.log`
2. **Status des services** : `pm2 status`
3. **Connexion DB** : `mysql -h 91.234.194.20 -u cp2111737p21_translate -p`
4. **Nginx** : `sudo nginx -t && sudo systemctl status nginx`
5. **Certificats SSL** : `certbot certificates`

---

## ✅ Checklist de Déploiement

### 🔧 Avant le Déploiement
- [ ] Backend exemple testé localement
- [ ] Base de données créée avec le bon script
- [ ] Authentification fonctionnelle
- [ ] Variables d'environnement configurées (dev/prod)
- [ ] Variables d'environnement configurées
- [ ] Base de données créée et migrée
- [ ] Certificats SSL installés
- [ ] Nginx configuré
- [ ] PM2 configuré
- [ ] Tests de charge effectués
- [ ] Sauvegardes configurées
- [ ] Monitoring activé

### 🚀 Après le Déploiement
- [ ] Test de connexion admin
- [ ] Test d'inscription utilisateur
- [ ] Vérification des logs backend
- [ ] Test des fonctionnalités principales
- [ ] Tests fonctionnels complets
- [ ] Vérification des métriques
- [ ] Tests de performance
- [ ] Validation des paiements
- [ ] Tests multilingues
- [ ] Documentation mise à jour
- [ ] Formation équipe support

---

**🎉 Votre application TranslateAI est maintenant prête pour la production !**