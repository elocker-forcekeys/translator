import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  BarChart3, 
  Settings, 
  CreditCard, 
  AlertCircle,
  TrendingUp,
  Globe,
  Server,
  UserCheck,
  UserX,
  Crown,
  Eye
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Utilisateurs totaux', value: '12,456', icon: Users, color: 'blue', change: '+12%' },
    { name: 'Traductions aujourd\'hui', value: '89,234', icon: Globe, color: 'green', change: '+8%' },
    { name: 'Revenus ce mois', value: '€34,567', icon: CreditCard, color: 'purple', change: '+15%' },
    { name: 'Taux de conversion', value: '3.2%', icon: TrendingUp, color: 'orange', change: '+0.3%' }
  ];

  const users = [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', plan: 'pro', status: 'active', wordsUsed: 15000, joinDate: '2024-01-15' },
    { id: 2, name: 'Marie Martin', email: 'marie@example.com', plan: 'free', status: 'active', wordsUsed: 800, joinDate: '2024-01-10' },
    { id: 3, name: 'Pierre Durand', email: 'pierre@example.com', plan: 'enterprise', status: 'active', wordsUsed: 89000, joinDate: '2024-01-05' },
    { id: 4, name: 'Sophie Leblanc', email: 'sophie@example.com', plan: 'pro', status: 'inactive', wordsUsed: 5000, joinDate: '2024-01-01' }
  ];

  const apiUsage = [
    { endpoint: '/translate', requests: 45678, avgLatency: '45ms', errorRate: '0.2%' },
    { endpoint: '/ocr', requests: 12345, avgLatency: '1.2s', errorRate: '0.5%' },
    { endpoint: '/pdf', requests: 8901, avgLatency: '2.1s', errorRate: '0.8%' },
    { endpoint: '/languages', requests: 2345, avgLatency: '12ms', errorRate: '0.0%' }
  ];

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'api', name: 'API', icon: Server },
    { id: 'billing', name: 'Facturation', icon: CreditCard },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    };
    return badges[plan as keyof typeof badges] || badges.free;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          </div>
          <p className="text-gray-600 mt-2">Tableau de bord administrateur</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">État du système</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">API Translation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Service OCR</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Traitement PDF</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-900">Nouvel utilisateur inscrit</p>
                    <p className="text-xs text-gray-500">sophie@example.com - il y a 2 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-900">Nouveau paiement reçu</p>
                    <p className="text-xs text-gray-500">Plan Pro - 19€ - il y a 15 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-900">Limite de quota atteinte</p>
                    <p className="text-xs text-gray-500">Utilisateur jean@example.com - il y a 1 heure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPlanBadge(user.plan)}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.wordsUsed.toLocaleString()} mots
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <UserX className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance API</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requêtes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Latence moyenne
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taux d'erreur
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiUsage.map((api) => (
                      <tr key={api.endpoint}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {api.endpoint}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {api.requests.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {api.avgLatency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {api.errorRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Revenus ce mois</h4>
                <p className="text-3xl font-bold text-green-600">€34,567</p>
                <p className="text-sm text-gray-600 mt-2">+15% par rapport au mois dernier</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Abonnements actifs</h4>
                <p className="text-3xl font-bold text-blue-600">1,234</p>
                <p className="text-sm text-gray-600 mt-2">+8% par rapport au mois dernier</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Churn Rate</h4>
                <p className="text-3xl font-bold text-red-600">2.3%</p>
                <p className="text-sm text-gray-600 mt-2">-0.5% par rapport au mois dernier</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres système</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paramètres généraux */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Paramètres généraux</h4>
                  
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Maintenance programmée</p>
                    <p className="text-sm text-gray-600">Activer le mode maintenance</p>
                  </div>
                  <button 
                    onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      systemSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Nouveaux comptes</p>
                    <p className="text-sm text-gray-600">Autoriser les nouvelles inscriptions</p>
                  </div>
                  <button 
                    onClick={() => setSystemSettings({...systemSettings, allowRegistrations: !systemSettings.allowRegistrations})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      systemSettings.allowRegistrations ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.allowRegistrations ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Limite de quota par défaut</p>
                    <p className="text-sm text-gray-600">Nombre de mots pour les nouveaux comptes</p>
                  </div>
                  <input 
                    type="number" 
                    value={systemSettings.defaultWordLimit}
                    onChange={(e) => setSystemSettings({...systemSettings, defaultWordLimit: parseInt(e.target.value)})}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Taille max fichiers (MB)</p>
                    <p className="text-sm text-gray-600">Limite de taille pour les uploads</p>
                  </div>
                  <input 
                    type="number" 
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Vérification email</p>
                    <p className="text-sm text-gray-600">Obliger la vérification email</p>
                  </div>
                  <button 
                    onClick={() => setSystemSettings({...systemSettings, emailVerificationRequired: !systemSettings.emailVerificationRequired})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      systemSettings.emailVerificationRequired ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.emailVerificationRequired ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                </div>
                
                {/* Services et fonctionnalités */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Services et fonctionnalités</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Service OCR</p>
                      <p className="text-sm text-gray-600">Traduction d'images activée</p>
                    </div>
                    <button 
                      onClick={() => setSystemSettings({...systemSettings, ocrEnabled: !systemSettings.ocrEnabled})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        systemSettings.ocrEnabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.ocrEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Traduction PDF</p>
                      <p className="text-sm text-gray-600">Service de traduction PDF</p>
                    </div>
                    <button 
                      onClick={() => setSystemSettings({...systemSettings, pdfEnabled: !systemSettings.pdfEnabled})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        systemSettings.pdfEnabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.pdfEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Limite API (req/h)</p>
                      <p className="text-sm text-gray-600">Limite pour utilisateurs gratuits</p>
                    </div>
                    <input 
                      type="number" 
                      value={systemSettings.apiRateLimit}
                      onChange={(e) => setSystemSettings({...systemSettings, apiRateLimit: parseInt(e.target.value)})}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Traductions simultanées</p>
                      <p className="text-sm text-gray-600">Nombre max de traductions en parallèle</p>
                    </div>
                    <input 
                      type="number" 
                      value={systemSettings.maxConcurrentTranslations}
                      onChange={(e) => setSystemSettings({...systemSettings, maxConcurrentTranslations: parseInt(e.target.value)})}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Timeout session (jours)</p>
                      <p className="text-sm text-gray-600">Durée de validité des sessions</p>
                    </div>
                    <input 
                      type="number" 
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Configuration avancée */}
              <div className="mt-8 space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Configuration avancée</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL API de traduction
                    </label>
                    <input 
                      type="url" 
                      value={systemSettings.translationApiUrl}
                      onChange={(e) => setSystemSettings({...systemSettings, translationApiUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de support
                    </label>
                    <input 
                      type="email" 
                      value={systemSettings.supportEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Webhook Stripe
                    </label>
                    <input 
                      type="password" 
                      value={systemSettings.stripeWebhookSecret}
                      onChange={(e) => setSystemSettings({...systemSettings, stripeWebhookSecret: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="whsec_..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rétention logs (jours)
                    </label>
                    <input 
                      type="number" 
                      value={systemSettings.logRetention}
                      onChange={(e) => setSystemSettings({...systemSettings, logRetention: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                {/* Sauvegarde */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-gray-900">Sauvegarde automatique</p>
                      <p className="text-sm text-gray-600">Sauvegarde quotidienne de la base de données</p>
                    </div>
                    <button 
                      onClick={() => setSystemSettings({...systemSettings, autoBackup: !systemSettings.autoBackup})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        systemSettings.autoBackup ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Rétention des sauvegardes (jours)</span>
                    <input 
                      type="number" 
                      value={systemSettings.backupRetention}
                      onChange={(e) => setSystemSettings({...systemSettings, backupRetention: parseInt(e.target.value)})}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                
                {/* Boutons d'action */}
                <div className="flex space-x-4 pt-4 border-t">
                  <button 
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sauvegarder les paramètres
                  </button>
                  <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Réinitialiser
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Tester la configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal d'ajout d'utilisateur */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un utilisateur</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de l'utilisateur"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  value={newUser.plan}
                  onChange={(e) => setNewUser({...newUser, plan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="free">Gratuit</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite de mots
                </label>
                <input
                  type="number"
                  value={newUser.wordsLimit}
                  onChange={(e) => setNewUser({...newUser, wordsLimit: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer l'utilisateur
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;