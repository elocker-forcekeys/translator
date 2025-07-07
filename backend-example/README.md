# Backend TranslateAI

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier de configuration
cp .env.example .env

# Modifier les variables d'environnement
nano .env

# Démarrer en mode développement
npm run dev

# Ou démarrer en production
npm start
```

## Configuration

1. **Base de données** : Assurez-vous que votre base de données MySQL est accessible
2. **Variables d'environnement** : Configurez le fichier `.env`
3. **JWT Secret** : Changez la clé secrète JWT en production

## Test de connexion

```bash
# Test de connexion
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@translate.forcekeys.com","password":"admin123"}'
```

## Déploiement

1. **VPS/Serveur** : Déployez sur votre serveur
2. **PM2** : Utilisez PM2 pour la gestion des processus
3. **Nginx** : Configurez un reverse proxy
4. **SSL** : Activez HTTPS avec Let's Encrypt

```bash
# Avec PM2
pm2 start server.js --name "translateai-backend"
pm2 startup
pm2 save
```