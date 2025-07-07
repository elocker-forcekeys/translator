import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, Star, Zap, Crown, Globe } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Gratuit',
      price: '0',
      period: 'Toujours',
      description: 'Parfait pour découvrir nos services',
      icon: Globe,
      features: [
        '2 000 mots par mois',
        'Traduction texte basique',
        'Support par email',
        'Accès web uniquement',
        'Historique limité (7 jours)'
      ],
      popular: false,
      cta: 'Commencer gratuitement'
    },
    {
      name: 'Pro',
      price: '19',
      period: 'par mois',
      description: 'Idéal pour les professionnels',
      icon: Star,
      features: [
        '100 000 mots par mois',
        'Traduction texte, image, PDF',
        'Support prioritaire',
        'Accès API',
        'Historique illimité',
        'Intégrations avancées',
        'Formats de sortie multiples'
      ],
      popular: true,
      cta: 'Commencer l\'essai gratuit'
    },
    {
      name: 'Enterprise',
      price: '99',
      period: 'par mois',
      description: 'Pour les équipes et entreprises',
      icon: Crown,
      features: [
        'Mots illimités',
        'Toutes les fonctionnalités Pro',
        'Support dédié 24/7',
        'API haute performance',
        'Intégrations personnalisées',
        'Tableau de bord équipe',
        'SLA 99.9%',
        'Formation dédiée'
      ],
      popular: false,
      cta: 'Nous contacter'
    }
  ];

  const faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata.'
    },
    {
      question: 'Que se passe-t-il si je dépasse ma limite de mots ?',
      answer: 'Vous recevrez une notification avant d\'atteindre votre limite. Une fois dépassée, vous devrez upgrader votre plan ou attendre le prochain cycle de facturation.'
    },
    {
      question: 'L\'API est-elle incluse dans tous les plans ?',
      answer: 'L\'API est incluse dans les plans Pro et Enterprise. Le plan gratuit ne donne accès qu\'à l\'interface web.'
    },
    {
      question: 'Offrez-vous une garantie de remboursement ?',
      answer: 'Oui, nous offrons une garantie de remboursement de 30 jours sur tous nos plans payants, sans questions posées.'
    }
  ];

  const features = [
    {
      name: 'Traduction IA avancée',
      description: 'Précision de niveau professionnel avec notre IA propriétaire'
    },
    {
      name: 'Plus de 200 langues',
      description: 'Couvrez tous vos besoins linguistiques'
    },
    {
      name: 'OCR intelligent',
      description: 'Extrayez et traduisez le texte de vos images'
    },
    {
      name: 'Traitement PDF',
      description: 'Conservez la mise en forme de vos documents'
    },
    {
      name: 'API RESTful',
      description: 'Intégrez facilement dans vos applications'
    },
    {
      name: 'Sécurité entreprise',
      description: 'Chiffrement end-to-end et conformité RGPD'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. 
            Commencez gratuitement et évoluez à votre rythme.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : 'hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  Plus populaire
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${
                      plan.popular ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {plan.name}
                </h3>
                
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>
                
                <p className="text-gray-600 text-center mb-6">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités incluses
            </h2>
            <p className="text-xl text-gray-600">
              Toutes les fonctionnalités dont vous avez besoin pour réussir
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur nos plans
            </p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d'utilisateurs satisfaits
          </p>
          
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Accéder à mon dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Commencer gratuitement
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;