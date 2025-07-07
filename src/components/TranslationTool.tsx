import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../config/api';
import apiService from '../services/api';
import { 
  Languages, 
  FileText, 
  Image, 
  File, 
  Copy, 
  ArrowRightLeft,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';

interface TranslationToolProps {
  isLimited?: boolean;
}

const TranslationTool: React.FC<TranslationToolProps> = ({ isLimited = false }) => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const languages = SUPPORTED_LANGUAGES;

  const checkWordLimit = (text: string) => {
    const wordCount = text.trim().split(/\s+/).length;
    if (isLimited && wordCount > 2000) {
      setError(t('wordLimitReached'));
      return false;
    }
    if (user && wordCount + user.wordsUsed > user.wordsLimit) {
      setError(t('userWordLimitReached'));
      return false;
    }
    return true;
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setError('');
    if (!checkWordLimit(sourceText)) return;

    setIsTranslating(true);
    
    try {
      const response = await apiService.translate({
        text: sourceText,
        sourceLang: sourceLang,
        targetLang: targetLang
      });

      if (response.success && response.data) {
        setTargetText(response.data.translation);
      } else {
        throw new Error(response.message || 'Translation failed');
      }
      
      // Mettre à jour le compteur de mots utilisés
      if (user) {
        const wordCount = sourceText.trim().split(/\s+/).length;
        updateUser({ wordsUsed: user.wordsUsed + wordCount });
      }
      
    } catch (err) {
      console.error('Translation error:', err);
      setError(t('translationError'));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return;
    
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    const tempText = sourceText;
    setSourceText(targetText);
    setTargetText(tempText);
  };

  const handleCopy = async () => {
    if (!targetText) return;
    
    try {
      await navigator.clipboard.writeText(targetText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'text' | 'image' | 'pdf') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    const reader = new FileReader();
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
      }
    };
    
    reader.onload = async (e) => {
      try {
        let extractedText = '';
        
        if (type === 'text') {
          extractedText = e.target?.result as string;
        } else if (type === 'image') {
          // Simulation OCR
          extractedText = `[Texte extrait de l'image ${file.name}] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
        } else if (type === 'pdf') {
          // Simulation extraction PDF
          extractedText = `[Texte extrait du PDF ${file.name}] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`;
        }
        
        setSourceText(extractedText);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (err) {
        setError(`Erreur lors du traitement du fichier ${type}.`);
        setUploadProgress(0);
      }
    };
    
    if (type === 'text') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Languages className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Traducteur Avancé</h2>
          </div>
          {isLimited && (
            <div className="bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full text-sm">
              Limité à 2000 mots
            </div>
          )}
        </div>
      </div>

      {/* Language Selection */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <select 
            value={sourceLang} 
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          
          <button
            onClick={handleSwapLanguages}
            disabled={sourceLang === 'auto'}
            className="mx-4 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>
          
          <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.filter(lang => lang.code !== 'auto').map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Translation Interface */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Text */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{t('sourceText')}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={t('importTextFile')}
                >
                  <FileText className="h-5 w-5" />
                </button>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={t('importImage')}
                >
                  <Image className="h-5 w-5" />
                </button>
                <button
                  onClick={() => pdfInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={t('importPdf')}
                >
                  <File className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={t('enterText')}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{sourceText.length} {t('characters')}</span>
              <span>{sourceText.trim().split(/\s+/).filter(w => w.length > 0).length} {t('words')}</span>
            </div>
          </div>

          {/* Target Text */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{t('translation')}</h3>
              <button
                onClick={handleCopy}
                disabled={!targetText}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('copyTranslation')}
              >
                {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            
            <textarea
              value={targetText}
              readOnly
              placeholder={t('translationWillAppear')}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none"
            />
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{targetText.length} {t('characters')}</span>
              <span>{targetText.trim().split(/\s+/).filter(w => w.length > 0).length} {t('words')}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Translate Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTranslating ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('translating')}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Languages className="h-5 w-5" />
                <span>{t('translate')}</span>
              </div>
            )}
          </button>
        </div>

        {/* Usage Info */}
        {user && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {t('wordsUsed')} : {user.wordsUsed.toLocaleString()} / {user.wordsLimit.toLocaleString()}
              </span>
              <div className="w-32 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((user.wordsUsed / user.wordsLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={(e) => handleFileUpload(e, 'text')}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileUpload(e, 'pdf')}
        className="hidden"
      />
    </div>
  );
};

export default TranslationTool;