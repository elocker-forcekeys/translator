# TranslateAI Backend

Backend API complet pour l'application TranslateAI avec Node.js, Express et MySQL.

## 🚀 Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 8.0.0
- Accès à la base de données MySQL

### Installation des dépendances
```bash
cd backend
npm install
```

### Configuration
```bash
# Copier le fichier de configuration
cp .env.example .env

# Modifier les variables d'environnement
nano .env
```

### Démarrage
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📁 Structure du projet

```
backend/
├── src/
│   ├── app.js              # Application principale
│   ├── config/
│   │   └── database.js     # Configuration base de données
│   ├── middleware/
│   │   ├── auth.js         # Authentification JWT
│   │   ├── errorHandler.js # Gestion des erreurs
│   │   └── validation.js   # Validation des données
│   ├── routes/
│   │   ├── auth.js         # Routes d'authentification
│   │   ├── translation.js  # Routes de traduction
│   │   ├── user.js         # Routes utilisateur
│   │   ├── admin.js        # Routes administrateur
│   │   └── billing.js      # Routes de facturation
│   └── utils/
│       └── logger.js       # Système de logs
├── logs/                   # Fichiers de logs
├── uploads/                # Fichiers uploadés
├── .env.example           # Variables d'environnement
├── package.json
└── README.md
```

## 🔧 Configuration

### Variables d'environnement principales

```env
# Base de données
DB_HOST=91.234.194.20
DB_USER=cp2111737p21_translate
DB_PASSWORD=2J)ewo=OuYQk
DB_NAME=cp2111737p21_translate
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-min-32-characters
JWT_EXPIRES_IN=7d

# Serveur
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# API de traduction
TRANSLATION_API_URL=https://translateapi.forcekeys.com/translate
```

## 📚 API Endpoints

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `GET /api/v1/auth/profile` - Profil utilisateur
- `PUT /api/v1/auth/profile` - Mise à jour profil
- `POST /api/v1/auth/logout` - Déconnexion

### Traduction
- `POST /api/v1/translate` - Traduction de texte
- `POST /api/v1/translate/ocr` - OCR et traduction d'image
- `POST /api/v1/translate/pdf` - Traduction de PDF
- `GET /api/v1/translate/languages` - Langues supportées
- `GET /api/v1/translate/history` - Historique des traductions

### Utilisateur
- `GET /api/v1/user/usage` - Statistiques d'utilisation
- `GET /api/v1/user/subscription` - Informations d'abonnement
- `POST /api/v1/user/regenerate-api-key` - Régénérer clé API

### Administration (nécessite rôle admin)
- `GET /api/v1/admin/stats` - Statistiques globales
- `GET /api/v1/admin/users` - Liste des utilisateurs
- `GET /api/v1/admin/users/:id` - Détails utilisateur
- `PUT /api/v1/admin/users/:id` - Modifier utilisateur
- `GET /api/v1/admin/api-performance` - Performance API
- `GET /api/v1/admin/settings` - Paramètres système
- `PUT /api/v1/admin/settings` - Modifier paramètres

### Facturation
- `GET /api/v1/billing/plans` - Plans disponibles
- `GET /api/v1/billing/history` - Historique paiements
- `POST /api/v1/billing/create-payment` - Créer paiement
- `POST /api/v1/billing/webhook` - Webhook Stripe

## 🔒 Sécurité

### Fonctionnalités implémentées
- **Authentification JWT** avec tokens sécurisés
- **Hachage bcrypt** des mots de passe (12 rounds)
- **Rate limiting** pour prévenir les abus
- **Validation des données** avec Joi
- **Helmet.js** pour la sécurité des headers
- **CORS** configuré pour le frontend
- **Logs de sécurité** avec Winston

### Middleware de sécurité
- `authenticateToken` - Vérification JWT
- `requireAdmin` - Accès administrateur
- `requirePlan` - Vérification du plan utilisateur
- `validateRequest` - Validation des données

## 📊 Monitoring et Logs

### Système de logs
- **Winston** pour la gestion des logs
- Logs rotatifs par niveau (error, info, debug)
- Logs structurés en JSON
- Fichiers séparés pour erreurs et logs généraux

### Métriques disponibles
- Statistiques d'utilisation par utilisateur
- Performance des endpoints API
- Évolution du trafic
- Taux d'erreur par endpoint

## 🗄️ Base de données

### Connexion
- Pool de connexions MySQL2
- Reconnexion automatique
- Gestion des timeouts
- Transactions sécurisées

### Tables principales
- `users` - Utilisateurs et authentification
- `translations` - Historique des traductions
- `subscriptions` - Gestion des abonnements
- `payments` - Facturation
- `api_logs` - Logs des appels API
- `system_settings` - Configuration système

## 🧪 Tests

```bash
# Lancer les tests (à configurer)
npm test

# Linting
npm run lint
```

## 🚀 Déploiement

### Avec PM2
```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start src/app.js --name "translateai-backend"

# Sauvegarder la configuration
pm2 startup
pm2 save
```

### Variables d'environnement production
```env
NODE_ENV=production
JWT_SECRET=your-production-secret-min-32-chars
FRONTEND_URL=https://translate.forcekeys.com
```

## 🔧 Maintenance

### Commandes utiles
```bash
# Voir les logs en temps réel
tail -f logs/combined.log

# Redémarrer avec PM2
pm2 restart translateai-backend

# Voir le statut
pm2 status
```

### Nettoyage automatique
- Logs API > 90 jours supprimés automatiquement
- Sessions expirées nettoyées quotidiennement
- Fichiers temporaires supprimés

## 🆘 Dépannage

### Problèmes courants

1. **Erreur de connexion base de données**
   ```bash
   # Vérifier la connectivité
   mysql -h 91.234.194.20 -u cp2111737p21_translate -p
   ```

2. **Erreur JWT**
   - Vérifier que JWT_SECRET est défini
   - Minimum 32 caractères requis

3. **Erreur CORS**
   - Vérifier FRONTEND_URL dans .env
   - Ajouter l'origine dans ALLOWED_ORIGINS

### Logs utiles
```bash
# Erreurs uniquement
tail -f logs/error.log

# Tous les logs
tail -f logs/combined.log

# Logs en temps réel avec PM2
pm2 logs translateai-backend
```

## 📞 Support

Pour toute question ou problème :
- Vérifier les logs d'erreur
- Consulter la documentation API
- Contacter l'équipe de développement

---

**✅ Backend TranslateAI prêt pour la production !**