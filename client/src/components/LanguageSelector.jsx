import React, { useState } from 'react';

const LANGUAGES = [
  // Major Global Languages
  { code: 'en', name: 'English', flag: '🇺🇸', category: 'Global' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳', category: 'Global' },
  { code: 'zh-tw', name: 'Chinese (Traditional)', flag: '🇹🇼', category: 'Global' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', category: 'Global' },
  { code: 'fr', name: 'French', flag: '🇫🇷', category: 'Global' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', category: 'Global' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', category: 'Global' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', category: 'Global' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', category: 'Global' },
  { code: 'de', name: 'German', flag: '🇩🇪', category: 'Global' },
  
  // Indian Languages
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', category: 'Indian' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', category: 'Indian' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', category: 'Indian' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', category: 'Indian' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', category: 'Indian' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', category: 'Indian' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', category: 'Indian' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', category: 'Indian' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', category: 'Indian' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', category: 'Indian' },
  
  // European Languages
  { code: 'it', name: 'Italian', flag: '🇮🇹', category: 'European' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', category: 'European' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', category: 'European' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', category: 'European' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', category: 'European' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', category: 'European' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', category: 'European' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', category: 'European' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', category: 'European' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', category: 'European' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', category: 'European' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', category: 'European' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', category: 'European' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', category: 'European' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', category: 'European' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', category: 'European' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', category: 'European' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', category: 'European' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', category: 'European' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', category: 'European' },
  
  // Asian Languages
  { code: 'ko', name: 'Korean', flag: '🇰🇷', category: 'Asian' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', category: 'Asian' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', category: 'Asian' },
  { code: 'id', name: 'Indonesian', flag: '🇮����', category: 'Asian' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', category: 'Asian' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭', category: 'Asian' },
  { code: 'my', name: 'Myanmar', flag: '🇲🇲', category: 'Asian' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', category: 'Asian' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', category: 'Asian' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰', category: 'Asian' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', category: 'Asian' },
  
  // Middle Eastern & Central Asian
  { code: 'fa', name: 'Persian', flag: '🇮🇷', category: 'Middle Eastern' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', category: 'Middle Eastern' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', category: 'Middle Eastern' },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', category: 'Middle Eastern' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', category: 'Middle Eastern' },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', category: 'Middle Eastern' },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', category: 'Middle Eastern' },
  { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬', category: 'Middle Eastern' },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', category: 'Middle Eastern' },
  
  // African Languages
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', category: 'African' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', category: 'African' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', category: 'African' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', category: 'African' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', category: 'African' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', category: 'African' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', category: 'African' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦', category: 'African' },
  { code: 'so', name: 'Somali', flag: '🇸🇴', category: 'African' },
  
  // Latin American
  { code: 'pt-br', name: 'Portuguese (Brazil)', flag: '🇧🇷', category: 'Latin American' },
  { code: 'es-mx', name: 'Spanish (Mexico)', flag: '🇲🇽', category: 'Latin American' },
  { code: 'es-ar', name: 'Spanish (Argentina)', flag: '🇦🇷', category: 'Latin American' },
  { code: 'es-co', name: 'Spanish (Colombia)', flag: '🇨🇴', category: 'Latin American' },
  { code: 'es-pe', name: 'Spanish (Peru)', flag: '🇵🇪', category: 'Latin American' },
  { code: 'es-ve', name: 'Spanish (Venezuela)', flag: '🇻🇪', category: 'Latin American' },
  { code: 'es-cl', name: 'Spanish (Chile)', flag: '🇨🇱', category: 'Latin American' },
  { code: 'qu', name: 'Quechua', flag: '🇵🇪', category: 'Latin American' },
  { code: 'gn', name: 'Guarani', flag: '🇵🇾', category: 'Latin American' },
];

const CATEGORIES = [
  { id: 'Global', name: 'Global Languages', icon: '🌍' },
  { id: 'Indian', name: 'Indian Languages', icon: '🇮🇳' },
  { id: 'European', name: 'European Languages', icon: '🇪🇺' },
  { id: 'Asian', name: 'Asian Languages', icon: '🌏' },
  { id: 'Middle Eastern', name: 'Middle Eastern', icon: '🕌' },
  { id: 'African', name: 'African Languages', icon: '🌍' },
  { id: 'Latin American', name: 'Latin American', icon: '🌎' },
];

const LanguageSelector = ({ value, onChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('Global');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = LANGUAGES.filter(language => {
    const matchesCategory = selectedCategory === 'All' || language.category === selectedCategory;
    const matchesSearch = language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularLanguages = LANGUAGES.filter(lang => 
    ['en', 'zh', 'es', 'hi', 'ar', 'pt', 'ru', 'ja', 'fr', 'de'].includes(lang.code)
  );

  return (
    <div className="glass-card p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Choose Your Preferred Language
        </h3>
        <p className="text-white/70">
          Select from {LANGUAGES.length}+ languages for your simplified explanation
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input w-full pl-12"
          />
          <svg className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Popular Languages */}
      {!searchTerm && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">⭐</span>
            Popular Languages
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {popularLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => onChange(language.code)}
                className={`glass-card p-4 transition-all duration-300 hover-lift ${
                  value === language.code
                    ? 'border-blue-400/50 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-2">{language.flag}</div>
                <div className={`text-sm font-medium ${
                  value === language.code ? 'text-blue-200' : 'text-white/80'
                }`}>
                  {language.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {!searchTerm && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`glass-card px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'All'
                  ? 'bg-purple-500/30 text-purple-200 border-purple-400/50'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              All Languages
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`glass-card px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-purple-500/30 text-purple-200 border-purple-400/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Language Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
        {filteredLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => onChange(language.code)}
            className={`glass-card p-4 transition-all duration-300 hover-lift ${
              value === language.code
                ? 'border-blue-400/50 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                : 'border-white/20 hover:border-white/40 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl mb-2">{language.flag}</div>
            <div className={`text-sm font-medium ${
              value === language.code ? 'text-blue-200' : 'text-white/80'
            }`}>
              {language.name}
            </div>
          </button>
        ))}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="text-center py-8">
          <div className="text-white/60 text-lg">
            No languages found matching "{searchTerm}"
          </div>
        </div>
      )}

      {/* Language Count */}
      <div className="mt-6 text-center">
        <div className="text-white/60 text-sm">
          Showing {filteredLanguages.length} of {LANGUAGES.length} languages
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;