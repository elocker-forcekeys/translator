import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TranslationTool from '../components/TranslationTool';
import { 
  BarChart3, 
  Languages, 
  FileText, 
  Clock, 
  TrendingUp,
  Calendar,
  Download,
  Key,
  CreditCard,
  Users,
  Globe
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Mots traduits', value: user?.wordsUsed?.toLocaleString() || '0', icon: Languages, color: 'blue' },
    { name: 'Documents traités', value: '127', icon: FileText, color: 'green' },
    { name: 'Traductions ce mois', value: '1,234', icon: TrendingUp, color: 'purple' },
    { name: 'Économies estimées', value: '€2,450', icon: CreditCard, color: 'orange' }
  ];

  const recentTranslations = [
    { id: 1, text: 'Hello world', from: 'en', to: 'fr', result: 'Bonjour le monde', date: '2024-01-15T10:30:00Z' },
    { id: 2, text: 'Como estas?', from: 'es', to: 'en', result: 'How are you?', date: '2024-01-15T09:15:00Z' },
    { id: 3, text: 'Guten Tag', from: 'de', to: 'fr', result: 'Bonjour', date: '2024-01-14T16:45:00Z' },
    { id: 4, text: 'Merci beaucoup', from: 'fr', to: 'en', result: 'Thank you very much', date: '2024-01-14T14:20:00Z' }
  ];

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'translate', name: 'Traduire', icon: Languages },
    { id: 'history', name: 'Historique', icon: Clock },
    { id: 'api', name: 'API', icon: Key },
    { id: 'billing', name: 'Facturation', icon: CreditCard }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bienvenue, {user?.name}!</p>
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
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation du plan</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mots utilisés</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.wordsUsed?.toLocaleString()} / {user?.wordsLimit?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((user?.wordsUsed || 0) / (user?.wordsLimit || 1)) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Plan {user?.plan}</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    Améliorer le plan
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Translations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traductions récentes</h3>
              <div className="space-y-4">
                {recentTranslations.map((translation) => (
                  <div key={translation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{translation.text}</p>
                      <p className="text-sm text-gray-600 mt-1">{translation.result}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="uppercase">{translation.from}</span>
                        <span className="mx-2">→</span>
                        <span className="uppercase">{translation.to}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(translation.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'translate' && (
          <div>
            <TranslationTool />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des traductions</h3>
            <div className="space-y-4">
              {recentTranslations.map((translation) => (
                <div key={translation.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{translation.text}</p>
                      <p className="text-gray-600 mt-1">{translation.result}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Globe className="h-4 w-4 mr-1" />
                        <span className="uppercase">{translation.from}</span>
                        <span className="mx-2">→</span>
                        <span className="uppercase">{translation.to}</span>
                        <span className="mx-4">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(translation.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        Retraduire
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clé API</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Clé API actuelle</p>
                    <p className="text-sm text-gray-600 font-mono">{user?.apiKey}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Copier
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Régénérer
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Documentation
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation API</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-gray-600">Requêtes ce mois</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                  <p className="text-sm text-gray-600">Disponibilité</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">45ms</p>
                  <p className="text-sm text-gray-600">Latence moyenne</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan actuel</h3>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 capitalize">Plan {user?.plan}</p>
                  <p className="text-sm text-gray-600">
                    {user?.plan === 'free' ? 'Gratuit' : user?.plan === 'pro' ? '19€/mois' : '99€/mois'}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Changer de plan
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des paiements</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Plan Pro - Janvier 2024</p>
                    <p className="text-sm text-gray-600">15 janvier 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">19,00 €</p>
                    <p className="text-sm text-green-600">Payé</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Plan Pro - Décembre 2023</p>
                    <p className="text-sm text-gray-600">15 décembre 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">19,00 €</p>
                    <p className="text-sm text-green-600">Payé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;