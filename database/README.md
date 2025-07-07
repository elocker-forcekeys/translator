# 📊 Base de Données TranslateAI

## 📍 Emplacement du Script

Le script de création de la base de données se trouve dans :
```
database/schema.sql
```

## 🔧 Paramètres de Connexion

```
Serveur: 91.234.194.20
Utilisateur: cp2111737p21_translate
Mot de passe: 2J)ewo=OuYQk
Base de données: cp2111737p21_translate
Port: 3306
```

## 🚀 Installation

### 1. Via MySQL Command Line
```bash
mysql -h 91.234.194.20 -u cp2111737p21_translate -p cp2111737p21_translate < database/schema.sql
```

### 2. Via phpMyAdmin
1. Connectez-vous à phpMyAdmin
2. Sélectionnez la base `cp2111737p21_translate`
3. Allez dans l'onglet "SQL"
4. Copiez-collez le contenu de `database/schema.sql`
5. Exécutez le script

### 3. Via MySQL Workbench
1. Ouvrez MySQL Workbench
2. Créez une nouvelle connexion avec les paramètres ci-dessus
3. Ouvrez le fichier `database/schema.sql`
4. Exécutez le script

## 📋 Structure de la Base de Données

### Tables Principales

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs et leurs informations |
| `translations` | Historique des traductions |
| `subscriptions` | Abonnements utilisateurs |
| `payments` | Historique des paiements |
| `supported_languages` | Langues supportées (200+) |
| `usage_stats` | Statistiques d'utilisation |
| `api_logs` | Logs des appels API |
| `system_settings` | Paramètres système |
| `user_sessions` | Sessions utilisateur |
| `uploaded_files` | Fichiers uploadés |

### Vues

| Vue | Description |
|-----|-------------|
| `global_stats` | Statistiques globales de l'application |
| `user_stats` | Statistiques par utilisateur |

### Procédures Stockées

| Procédure | Description |
|-----------|-------------|
| `CleanOldData()` | Nettoyage des anciennes données |
| `UpdateUsageStats()` | Mise à jour des statistiques |

## 🔐 Sécurité

- **Mots de passe** : Hachés avec bcrypt (12 rounds)
- **API Keys** : Générées automatiquement (32 caractères)
- **Sessions** : Gestion avec tokens JWT
- **Index** : Optimisés pour les performances

## 📊 Données Initiales

Le script inclut :
- **200+ langues** supportées avec drapeaux
- **Paramètres système** par défaut
- **Utilisateur admin** : `admin@translate.forcekeys.com` (mot de passe: `admin123`)

## 🔄 Maintenance Automatique

### Événements Programmés
- **Nettoyage quotidien** : Suppression des anciennes données
- **Statistiques horaires** : Mise à jour des métriques

### Triggers
- **Génération API Key** : Automatique à la création d'utilisateur
- **Compteur de mots** : Mise à jour automatique après traduction

## 📈 Monitoring

### Métriques Disponibles
- Nombre d'utilisateurs total/nouveaux
- Traductions par jour/mois
- Mots traduits
- Revenus mensuels
- Abonnements actifs

### Logs
- Appels API avec temps de réponse
- Erreurs et exceptions
- Utilisation par utilisateur

## 🛠️ Configuration Backend

### Variables d'Environnement Requises
```env
DB_HOST=91.234.194.20
DB_USER=cp2111737p21_translate
DB_PASSWORD=2J)ewo=OuYQk
DB_NAME=cp2111737p21_translate
DB_PORT=3306
```

### API de Traduction
```env
TRANSLATION_API_URL=https://translateapi.forcekeys.com/translate
```

## 🔧 Optimisations

### Index Créés
- Index composites pour les requêtes fréquentes
- Index sur les clés étrangères
- Index sur les colonnes de recherche

### Performance
- Partitioning par date pour les logs (recommandé)
- Cache Redis pour les sessions (recommandé)
- CDN pour les fichiers statiques (recommandé)

## 📝 Notes Importantes

1. **Sauvegarde** : Configurez des sauvegardes automatiques quotidiennes
2. **Monitoring** : Surveillez l'espace disque et les performances
3. **Sécurité** : Changez le mot de passe admin par défaut
4. **SSL** : Utilisez toujours des connexions chiffrées
5. **Logs** : Configurez la rotation des logs pour éviter la saturation

## 🆘 Support

En cas de problème avec la base de données :
1. Vérifiez les logs MySQL
2. Contrôlez l'espace disque disponible
3. Vérifiez les permissions utilisateur
4. Consultez les métriques de performance