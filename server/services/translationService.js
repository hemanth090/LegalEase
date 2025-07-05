import Groq from 'groq-sdk';

// Initialize Groq client lazily when needed
let groq = null;
let groqInitialized = false;

function initializeGroq() {
  if (groqInitialized) return groq;
  
  console.log('🔑 Initializing Groq for translation...');
  
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    try {
      groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
      console.log('✅ Groq translation client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Groq translation client:', error);
      groq = null;
    }
  } else {
    console.log('❌ Groq API key not configured for translation');
    groq = null;
  }
  
  groqInitialized = true;
  return groq;
}

// Comprehensive language mapping with full names
const LANGUAGE_NAMES = {
  // Major Global Languages
  'en': 'English',
  'zh': 'Chinese (Simplified) - 中文(简体)',
  'zh-tw': 'Chinese (Traditional) - 中文(繁體)',
  'es': 'Spanish - Español',
  'fr': 'French - Français',
  'ar': 'Arabic - العربية',
  'pt': 'Portuguese - Português',
  'ru': 'Russian - Русский',
  'ja': 'Japanese - 日本語',
  'de': 'German - Deutsch',
  
  // Indian Languages
  'hi': 'Hindi - हिंदी',
  'bn': 'Bengali - বাংলা',
  'te': 'Telugu - తెలుగు',
  'mr': 'Marathi - मराठी',
  'ta': 'Tamil - தமிழ்',
  'gu': 'Gujarati - ગુજરાતી',
  'ur': 'Urdu - اردو',
  'kn': 'Kannada - ಕನ್ನಡ',
  'ml': 'Malayalam - മലയാളം',
  'pa': 'Punjabi - ਪੰਜਾਬੀ',
  
  // European Languages
  'it': 'Italian - Italiano',
  'nl': 'Dutch - Nederlands',
  'pl': 'Polish - Polski',
  'sv': 'Swedish - Svenska',
  'no': 'Norwegian - Norsk',
  'da': 'Danish - Dansk',
  'fi': 'Finnish - Suomi',
  'el': 'Greek - Ελληνικά',
  'cs': 'Czech - Čeština',
  'hu': 'Hungarian - Magyar',
  'uk': 'Ukrainian - Українська',
  'bg': 'Bulgarian - Български',
  'ro': 'Romanian - Română',
  'hr': 'Croatian - Hrvatski',
  'sr': 'Serbian - Српски',
  'sk': 'Slovak - Slovenčina',
  'sl': 'Slovenian - Slovenščina',
  'et': 'Estonian - Eesti',
  'lv': 'Latvian - Latviešu',
  'lt': 'Lithuanian - Lietuvių',
  
  // Asian Languages
  'ko': 'Korean - 한국어',
  'th': 'Thai - ไทย',
  'vi': 'Vietnamese - Tiếng Việt',
  'id': 'Indonesian - Bahasa Indonesia',
  'ms': 'Malay - Bahasa Melayu',
  'tl': 'Filipino - Filipino',
  'my': 'Myanmar - မြန်မာ',
  'km': 'Khmer - ខ្មែរ',
  'lo': 'Lao - ລາວ',
  'si': 'Sinhala - සිංහල',
  'ne': 'Nepali - नेपाली',
  
  // Middle Eastern & Central Asian
  'fa': 'Persian - فارسی',
  'tr': 'Turkish - Türkçe',
  'he': 'Hebrew - עברית',
  'az': 'Azerbaijani - Azərbaycan',
  'ka': 'Georgian - ქართული',
  'hy': 'Armenian - Հայերեն',
  'kk': 'Kazakh - Қазақша',
  'ky': 'Kyrgyz - Кыргызча',
  'uz': 'Uzbek - Oʻzbekcha',
  
  // African Languages
  'sw': 'Swahili - Kiswahili',
  'am': 'Amharic - አማርኛ',
  'yo': 'Yoruba - Yorùbá',
  'ig': 'Igbo - Igbo',
  'ha': 'Hausa - Hausa',
  'zu': 'Zulu - isiZulu',
  'af': 'Afrikaans - Afrikaans',
  'xh': 'Xhosa - isiXhosa',
  'so': 'Somali - Soomaali',
  
  // Latin American
  'pt-br': 'Portuguese (Brazil) - Português (Brasil)',
  'es-mx': 'Spanish (Mexico) - Español (México)',
  'es-ar': 'Spanish (Argentina) - Español (Argentina)',
  'es-co': 'Spanish (Colombia) - Español (Colombia)',
  'es-pe': 'Spanish (Peru) - Español (Perú)',
  'es-ve': 'Spanish (Venezuela) - Español (Venezuela)',
  'es-cl': 'Spanish (Chile) - Español (Chile)',
  'qu': 'Quechua - Runasimi',
  'gn': 'Guarani - Avañe\'ẽ'
};

// Enhanced mock translations for fallback
const MOCK_TRANSLATIONS = {
  // Major Global Languages
  'zh': '# 📋 文档分析\n\n[这是一个中文翻译示例]\n\n**注意**: 要获得真正的翻译，请配置翻译服务。',
  'zh-tw': '# 📋 文檔分析\n\n[這是一個繁體中文翻譯示例]\n\n**注意**: 要獲得真正的翻譯，請配置翻譯服務。',
  'es': '# 📋 Análisis de Documento\n\n[Esta es una traducción de muestra en español]\n\n**Nota**: Para una traducción real, configure el servicio de traducción.',
  'fr': '# 📋 Analyse de Document\n\n[Ceci est un exemple de traduction française]\n\n**Note**: Pour une vraie traduction, configurez le service de traduction.',
  'ar': '# 📋 تحليل الوثيقة\n\n[هذا مثال على التر��مة العربية]\n\n**ملاحظة**: للحصول على ترجمة حقيقية، يرجى تكوين خدمة الترجمة.',
  'pt': '# 📋 Análise de Documento\n\n[Este é um exemplo de tradução em português]\n\n**Nota**: Para uma tradução real, configure o serviço de tradução.',
  'ru': '# 📋 Анализ Документа\n\n[Это пример русского перевода]\n\n**Примечание**: Для настоящего перевода настройте службу перевода.',
  'ja': '# 📋 文書分析\n\n[これは日本語翻訳のサンプルです]\n\n**注意**: 実際の翻訳には、翻訳サービスを設定してください。',
  'de': '# 📋 Dokumentenanalyse\n\n[Dies ist ein deutsches Übersetzungsbeispiel]\n\n**Hinweis**: Für eine echte Übersetzung konfigurieren Sie den Übersetzungsdienst.',
  'ko': '# 📋 문서 분석\n\n[이것은 한국어 번역 샘플입니다]\n\n**참고**: 실제 번역을 위해서는 번역 서비스를 구성하세요.',
  
  // Indian Languages
  'hi': '# 📋 दस्तावेज़ विश्लेषण\n\n[यह एक हिंदी अनुवाद नमूना है]\n\n**नोट**: वास्तविक अनुवाद के लिए, अनुवाद सेवा कॉन्फ़िगर करें।',
  'bn': '# 📋 নথি বিশ্লেষণ\n\n[এটি একটি বাংলা অনুবাদের নমুনা]\n\n**নোট**: প্রকৃত অনুবাদের জন্য, অনুবাদ সেবা কনফিগার করুন।',
  'te': '# 📋 పత్రం విశ్లేషణ\n\n[ఇది తెలుగు అనువాద నమూనా]\n\n**గమనిక**: వాస్తవ అనువాదం కోసం, అనువాద సేవను కాన్ఫిగర్ చేయండి।',
  'ta': '# 📋 ஆவண பகுப்பாய்வு\n\n[இது தமிழ் மொழிபெயர்ப்பு மாதிரி]\n\n**குறிப்பு**: உண்மையான மொழிபெயர்ப்புக்கு, மொழிபெயர்ப்பு சேவையை கட்டமைக்கவும்।',
  'gu': '# 📋 દસ્તાવેજ વિશ્લેષણ\n\n[આ ગુજરાતી અનુવાદનો નમૂનો છે]\n\n**નોંધ**: વાસ્તવિક અનુવાદ માટે, અનુવાદ સેવા ગોઠવો।',
  'kn': '# 📋 ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ\n\n[ಇದು ಕನ್ನಡ ಅನುವಾದದ ಮಾದರಿ]\n\n**ಸೂಚನೆ**: ನಿಜವಾದ ಅನುವಾದಕ್ಕಾಗಿ, ಅನುವಾದ ಸೇವೆಯನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ।',
  'ml': '# 📋 രേഖ വിശകലനം\n\n[ഇത് മലയാളം വിവർത്തനത്തിന്റെ സാമ്പിൾ ആണ്]\n\n**കുറിപ്പ്**: യഥാർത്ഥ വിവർത്തനത്തിനായി, വിവർത്തന സേവനം കോൺഫിഗർ ചെയ്യുക।',
  'mr': '# 📋 दस्तऐवज विश्लेषण\n\n[हे मराठी भाषांतराचे नमुना आहे]\n\n**टीप**: वास्तविक भाषांतरासाठी, भाषांतर सेवा कॉन्फिगर करा।',
  'pa': '# 📋 ਦਸਤਾਵੇਜ਼ ਵਿਸ਼ਲੇਸ਼ਣ\n\n[ਇਹ ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਦਾ ਨਮੂਨਾ ਹੈ]\n\n**ਨੋਟ**: ਅਸਲ ਅਨੁਵਾਦ ਲਈ, ਅਨੁਵਾਦ ਸੇਵਾ ਨੂੰ ਸੰਰਚਿਤ ਕਰੋ।',
  'ur': '# 📋 دستاویز کا تجزیہ\n\n[یہ اردو ترجمے کا نمونہ ہے]\n\n**نوٹ**: حقیقی ترجمے کے لیے، ترجمہ سروس کو کنفیگر کریں۔',
  
  // European Languages
  'it': '# 📋 Analisi del Documento\n\n[Questo è un esempio di traduzione italiana]\n\n**Nota**: Per una traduzione reale, configurare il servizio di traduzione.',
  'nl': '# 📋 Documentanalyse\n\n[Dit is een Nederlandse vertaalvoorbeeld]\n\n**Opmerking**: Voor een echte vertaling, configureer de vertaalservice.',
  'pl': '# 📋 Analiza Dokumentu\n\n[To jest przykład polskiego tłumaczenia]\n\n**Uwaga**: Aby uzyskać prawdziwe tłumaczenie, skonfiguruj usługę tłumaczenia.',
  'sv': '# 📋 Dokumentanalys\n\n[Detta är ett svenskt översättningsexempel]\n\n**Obs**: För en riktig översättning, konfigurera översättningstjänsten.',
  'no': '# 📋 Dokumentanalyse\n\n[Dette er et norsk oversettelseseksempel]\n\n**Merk**: For en ekte oversettelse, konfigurer oversettelsestjenesten.',
  'da': '# 📋 Dokumentanalyse\n\n[Dette er et dansk oversættelseseksempel]\n\n**Bemærk**: For en ægte oversættelse, konfigurer oversættelsestjenesten.',
  'fi': '# 📋 Asiakirja-analyysi\n\n[Tämä on suomalainen käännösesimerkki]\n\n**Huomautus**: Todellista käännöstä varten, määritä käännöspalvelu.',
  
  // Asian Languages
  'th': '# 📋 การวิเคราะห์เอกสาร\n\n[นี่คือตัวอย่างการแปลภาษาไทย]\n\n**หมายเหตุ**: สำหรับการแปลจริง กรุณากำหนดค่าบริการแปล',
  'vi': '# 📋 Phân tích Tài liệu\n\n[Đây là mẫu dịch tiếng Việt]\n\n**Lưu ý**: Để có bản dịch thực sự, hãy cấu hình dịch vụ dịch thuật.',
  'id': '# 📋 Analisis Dokumen\n\n[Ini adalah contoh terjemahan bahasa Indonesia]\n\n**Catatan**: Untuk terjemahan yang sebenarnya, konfigurasikan layanan terjemahan.',
  'ms': '# 📋 Analisis Dokumen\n\n[Ini adalah contoh terjemahan bahasa Melayu]\n\n**Nota**: Untuk terjemahan sebenar, konfigurasikan perkhidmatan terjemahan.',
  'tl': '# 📋 Pagsusuri ng Dokumento\n\n[Ito ay isang halimbawa ng pagsasalin sa Filipino]\n\n**Paalala**: Para sa tunay na pagsasalin, i-configure ang serbisyo ng pagsasalin.',
  
  // Middle Eastern
  'fa': '# 📋 تحلیل سند\n\n[این نمونه‌ای از ترجمه فارسی است]\n\n**توجه**: برای ترجمه واقعی، سرویس ترجمه را پیکربندی کنید.',
  'tr': '# 📋 Belge Analizi\n\n[Bu bir Türkçe çeviri örneğidir]\n\n**Not**: Gerçek çeviri için çeviri hizmetini yapılandırın.',
  'he': '# 📋 ניתוח מסמך\n\n[זוהי דוגמה לתרגום עברי]\n\n**הערה**: לתרגום אמיתי, הגדר את שירות התרגום.',
  
  // African Languages
  'sw': '# 📋 Uchambuzi wa Hati\n\n[Hii ni mfano wa tafsiri ya Kiswahili]\n\n**Kumbuka**: Kwa tafsiri halisi, sanidi huduma ya tafsiri.',
  'am': '# 📋 ሰነድ ትንተና\n\n[ይህ የአማርኛ ትርጉም ናሙና ነው]\n\n**ማስታወሻ**: ለእውነተኛ ትርጉም፣ የትርጉም አገልግሎቱን ያዋቅሩ።',
  'yo': '# 📋 Ìtúpalẹ̀ Ìwé\n\n[Èyí ni àpẹẹrẹ ìtumọ̀ Yorùbá]\n\n**Àkíyèsí**: Fún ìtumọ̀ gidi, ṣètò iṣẹ́ ìtumọ̀.',
  
  // Default fallback
  'default': '# 📋 Document Analysis\n\n[Translation service not configured for this language]\n\n**Note**: Please configure the translation service for proper language support.'
};

export async function translateText(text, targetLanguage) {
  console.log('🌐 Translation service called for language:', targetLanguage);
  console.log('📝 Text length to translate:', text.length);
  
  try {
    if (targetLanguage === 'en') {
      console.log('✅ No translation needed for English');
      return text; // No translation needed
    }

    // Initialize Groq client when needed
    const groqClient = initializeGroq();
    
    if (!groqClient) {
      console.log('❌ No Groq client available - using mock translation');
      // Use enhanced mock translation
      const mockTranslation = MOCK_TRANSLATIONS[targetLanguage] || MOCK_TRANSLATIONS['default'];
      return mockTranslation.replace('[Translation service not configured for this language]', 
        `[${LANGUAGE_NAMES[targetLanguage] || targetLanguage} translation sample]`);
    }

    const targetLanguageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    
    console.log('🚀 Calling Groq API for translation to:', targetLanguageName);
    
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional translator specializing in legal document translation. Translate the given legal document analysis from English to ${targetLanguageName}. 

CRITICAL INSTRUCTIONS:
1. Translate ALL content including headings, bullet points, body text, and technical terms
2. Maintain the exact markdown formatting (headers with #, ##, ###, bullet points with -, numbered lists, etc.)
3. Keep emojis in their original positions
4. Preserve the structure and organization of the document exactly
5. Use natural, fluent ${targetLanguageName} that is appropriate for legal contexts
6. Translate technical legal terms accurately while keeping them understandable
7. Do not add any explanatory notes about the translation process
8. Keep the professional tone and clarity of the original
9. For right-to-left languages (Arabic, Hebrew, Persian, Urdu), maintain proper text direction
10. Use appropriate formal register for the target language

Translate the entire document completely and accurately while preserving all formatting.`
        },
        {
          role: "user",
          content: `Please translate this complete legal document analysis to ${targetLanguageName}:\n\n${text}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_completion_tokens: 4000,
      top_p: 1,
      stream: false
    });

    const translatedText = completion.choices[0]?.message?.content || text;
    
    console.log('✅ Translation completed successfully');
    console.log('📝 Translated text length:', translatedText.length);
    console.log('📝 Translation preview:', translatedText.substring(0, 200) + '...');
    
    return translatedText;

  } catch (error) {
    console.error('❌ Translation Error:', error.message);
    console.error('❌ Full translation error:', error);
    
    // Return a fallback translation with error message
    const targetLanguageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    return `# 📋 Document Analysis - Translation Error

**Translation Service Error**: Unable to translate to ${targetLanguageName}

**Original Content (English):**

${text}

**Error Details:** ${error.message}

**Note:** Please check the translation service configuration or try again later.`;
  }
}