import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TranslationTool from '../components/TranslationTool';
import { 
  Languages, 
  FileText, 
  Image, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un petit délai pour s'assurer que tout est chargé
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Languages,
      title: 'Traduction Intelligente',
      description: 'Traduisez avec précision dans plus de 200 langues grâce à notre IA avancée'
    },
    {
      icon: FileText,
      title: 'Documents PDF',
      description: 'Conservez la mise en forme originale de vos documents lors de la traduction'
    },
    {
      icon: Image,
      title: 'OCR Avancé',
      description: 'Extrayez et traduisez le texte de vos images avec une précision exceptionnelle'
    },
    {
      icon: Zap,
      title: 'Traduction Rapide',
      description: 'Obtenez des traductions instantanées et de haute qualité'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées par un chiffrement de niveau entreprise'
    },
    {
      icon: Globe,
      title: 'API Publique',
      description: 'Intégrez facilement nos services dans vos applications'
    }
  ];

  const stats = [
    { number: '200+', label: 'Langues supportées' },
    { number: '10M+', label: 'Mots traduits' },
    { number: '50K+', label: 'Utilisateurs satisfaits' },
    { number: '99.9%', label: 'Temps de disponibilité' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Chargement de TranslateAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fadeInUp">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Traduisez sans limites avec 
              <span className="text-yellow-300 text-shadow"> l'IA</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90 max-w-3xl mx-auto text-readable">
              Texte, images, PDF - Notre technologie de traduction avancée 
              vous accompagne dans toutes vos communications internationales.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-smooth shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  to="/pricing"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-smooth"
                >
                  Voir les tarifs
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Translation Tool */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essayez notre traducteur
            </h2>
            <p className="text-xl text-gray-600 text-readable">
              {user ? 'Traduisez sans limite' : 'Jusqu\'à 2000 mots gratuits sans inscription'}
            </p>
          </div>
          
          <div className="animate-slideInRight">
            <TranslationTool isLimited={!user} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir TranslateAI ?
            </h2>
            <p className="text-xl text-gray-600 text-readable">
              Des fonctionnalités puissantes pour tous vos besoins de traduction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-elevated p-6 hover:shadow-xl transition-smooth transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-soft">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-readable">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 text-contrast">
                  {stat.number}
                </div>
                <div className="text-white text-opacity-80 text-readable">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-contrast">
            Prêt à commencer ?
          </h2>
            <p className="text-xl text-gray-300 mb-8 text-readable">
            Rejoignez des milliers d'utilisateurs qui font confiance à TranslateAI
          </p>
          
          {user ? (
            <Link
              to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-smooth shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Accéder au Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-smooth shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/api-docs"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-smooth"
              >
                Documentation API
                <FileText className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;