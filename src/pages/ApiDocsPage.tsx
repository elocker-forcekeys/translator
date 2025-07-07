import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  Copy, 
  Check, 
  Book, 
  Key, 
  Globe, 
  FileText, 
  Image,
  Settings,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const ApiDocsPage: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState('');
  const [activeEndpoint, setActiveEndpoint] = useState('translate');

  const endpoints = [
    {
      id: 'translate',
      name: 'Traduction de texte',
      method: 'POST',
      path: '/api/v1/translate',
      description: 'Traduit un texte dans la langue de votre choix',
      icon: Globe
    },
    {
      id: 'ocr',
      name: 'OCR et traduction',
      method: 'POST',
      path: '/api/v1/ocr',
      description: 'Extrait le texte d\'une image et le traduit',
      icon: Image
    },
    {
      id: 'pdf',
      name: 'Traduction PDF',
      method: 'POST',
      path: '/api/v1/pdf',
      description: 'Traduit un document PDF en conservant sa structure',
      icon: FileText
    },
    {
      id: 'languages',
      name: 'Langues supportées',
      method: 'GET',
      path: '/api/v1/languages',
      description: 'Récupère la liste des langues supportées',
      icon: Book
    }
  ];

  const codeExamples = {
    translate: {
      curl: `curl -X POST https://api.translateai.com/v1/translate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Hello world",
    "source_lang": "en",
    "target_lang": "fr"
  }'`,
      javascript: `const response = await fetch('https://api.translateai.com/v1/translate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello world',
    source_lang: 'en',
    target_lang: 'fr'
  })
});

const data = await response.json();
console.log(data.translation);`,
      python: `import requests

response = requests.post('https://api.translateai.com/v1/translate', 
  headers={
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  json={
    'text': 'Hello world',
    'source_lang': 'en',
    'target_lang': 'fr'
  }
)

data = response.json()
print(data['translation'])`
    },
    ocr: {
      curl: `curl -X POST https://api.translateai.com/v1/ocr \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/image.jpg" \\
  -F "target_lang=fr"`,
      javascript: `const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('target_lang', 'fr');

const response = await fetch('https://api.translateai.com/v1/ocr', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const data = await response.json();
console.log(data);`,
      python: `import requests

files = {'image': open('/path/to/image.jpg', 'rb')}
data = {'target_lang': 'fr'}

response = requests.post('https://api.translateai.com/v1/ocr',
  headers={'Authorization': 'Bearer YOUR_API_KEY'},
  files=files,
  data=data
)

result = response.json()
print(result)`
    },
    pdf: {
      curl: `curl -X POST https://api.translateai.com/v1/pdf \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "pdf=@/path/to/document.pdf" \\
  -F "source_lang=en" \\
  -F "target_lang=fr"`,
      javascript: `const formData = new FormData();
formData.append('pdf', fileInput.files[0]);
formData.append('source_lang', 'en');
formData.append('target_lang', 'fr');

const response = await fetch('https://api.translateai.com/v1/pdf', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const blob = await response.blob();
// Télécharger le PDF traduit`,
      python: `import requests

files = {'pdf': open('/path/to/document.pdf', 'rb')}
data = {
  'source_lang': 'en',
  'target_lang': 'fr'
}

response = requests.post('https://api.translateai.com/v1/pdf',
  headers={'Authorization': 'Bearer YOUR_API_KEY'},
  files=files,
  data=data
)

with open('translated_document.pdf', 'wb') as f:
  f.write(response.content)`
    },
    languages: {
      curl: `curl -X GET https://api.translateai.com/v1/languages \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `const response = await fetch('https://api.translateai.com/v1/languages', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const languages = await response.json();
console.log(languages);`,
      python: `import requests

response = requests.get('https://api.translateai.com/v1/languages',
  headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

languages = response.json()
print(languages)`
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const [activeLanguage, setActiveLanguage] = useState<'curl' | 'javascript' | 'python'>('curl');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Documentation API</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Intégrez facilement nos services de traduction dans vos applications
          </p>
        </div>

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="text-blue-700">
                <strong>Connectez-vous</strong> pour obtenir votre clé API et commencer à utiliser nos services.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h3>
              <nav className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setActiveEndpoint(endpoint.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeEndpoint === endpoint.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <endpoint.icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{endpoint.name}</p>
                      <p className="text-xs text-gray-500">{endpoint.method} {endpoint.path}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* API Key Section */}
            {user && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Key className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Authentification</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Utilisez votre clé API pour authentifier vos requêtes :
                </p>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-700">
                    {user.apiKey}
                  </code>
                  <button
                    onClick={() => handleCopy(user.apiKey || '', 'apikey')}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    {copied === 'apikey' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="text-sm">Copier</span>
                  </button>
                </div>
              </div>
            )}

            {/* Endpoint Documentation */}
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className={`bg-white rounded-lg shadow-sm p-6 mb-8 ${
                  activeEndpoint === endpoint.id ? 'block' : 'hidden'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <endpoint.icon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">{endpoint.name}</h2>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.method === 'GET' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {endpoint.method}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{endpoint.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <code className="text-sm font-mono text-gray-700">
                    {endpoint.method} {endpoint.path}
                  </code>
                </div>

                {/* Code Examples */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">Exemples de code</h3>
                    <div className="flex space-x-2">
                      {['curl', 'javascript', 'python'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setActiveLanguage(lang as any)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            activeLanguage === lang
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript' : 'Python'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples[endpoint.id as keyof typeof codeExamples]?.[activeLanguage]}</code>
                    </pre>
                    <button
                      onClick={() => handleCopy(
                        codeExamples[endpoint.id as keyof typeof codeExamples]?.[activeLanguage] || '',
                        `${endpoint.id}-${activeLanguage}`
                      )}
                      className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md"
                    >
                      {copied === `${endpoint.id}-${activeLanguage}` ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Response Example */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Réponse</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify({
                      success: true,
                      data: {
                        translation: endpoint.id === 'translate' ? 'Bonjour le monde' : 
                                   endpoint.id === 'ocr' ? { extracted_text: 'Texte extrait', translation: 'Texte traduit' } :
                                   endpoint.id === 'pdf' ? { download_url: 'https://api.translateai.com/download/...' } :
                                   { languages: [{ code: 'fr', name: 'Français' }] }
                      },
                      usage: {
                        characters: 123,
                        words: 25
                      }
                    }, null, 2)}</code>
                  </pre>
                </div>
              </div>
            ))}

            {/* Rate Limits */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Limites de taux</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Plan Gratuit</h3>
                    <p className="text-sm text-gray-600">100 requêtes/heure</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Plan Pro</h3>
                    <p className="text-sm text-gray-600">1000 requêtes/heure</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Plan Enterprise</h3>
                    <p className="text-sm text-gray-600">Illimité</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SDKs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SDKs officiels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Code className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">JavaScript/Node.js</h3>
                    <p className="text-sm text-gray-600">npm install translateai-js</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Python</h3>
                    <p className="text-sm text-gray-600">pip install translateai-python</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;