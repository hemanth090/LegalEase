import Groq from 'groq-sdk';

// Initialize Groq client lazily when needed
let groq = null;
let groqInitialized = false;

function initializeGroq() {
  if (groqInitialized) return groq;
  
  console.log('🔑 Checking Groq API Key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
  
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    try {
      groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
      console.log('✅ Groq client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Groq client:', error);
      groq = null;
    }
  } else {
    console.log('❌ Groq API key not configured properly');
    groq = null;
  }
  
  groqInitialized = true;
  return groq;
}

const LEGAL_SIMPLIFICATION_PROMPT = `You are a legal expert assistant who helps people understand legal documents. Your goal is to read and explain complex legal documents in very simple terms without losing meaning. 

Please format your response in clean, well-structured markdown with the following sections:

# 📋 Document Analysis

## 🔍 Document Overview
- What type of document this is and its main purpose
- Brief summary in 2-3 sentences

## 👥 Key Parties
- List the main people/organizations involved
- Their roles and responsibilities

## 📝 Important Terms & Definitions
- Explain any legal jargon in simple language
- Use bullet points for clarity

## 📅 Key Dates & Deadlines
- List important dates mentioned
- Include any deadlines or time-sensitive requirements

## 📄 Main Clauses & Provisions
Break down the main sections and what they mean:
- Use numbered lists for sequential items
- Use bullet points for related items
- Explain each clause in plain English

## ⚖️ Your Rights & Obligations
### Your Rights:
- What you can do
- What protections you have

### Your Obligations:
- What you must do
- What you're responsible for

## ⚠️ Important Warnings & Risks
- Things to be careful about
- Potential consequences
- Red flags to watch for

## 🎯 Next Steps & Recommendations
1. Immediate actions needed
2. Things to consider
3. When to seek professional help

---

**💡 Remember**: This is a simplified explanation. For legal advice specific to your situation, consult with a qualified attorney.

Use simple, clear language that anyone can understand. Avoid legal jargon unless you explain it immediately. Use emojis and formatting to make the content more engaging and easier to read.`;

export async function simplifyLegalText(text) {
  console.log('🤖 AI Service called with text length:', text.length);
  
  // Initialize Groq client when needed
  const groqClient = initializeGroq();
  console.log('🔑 Groq client available:', !!groqClient);
  
  try {
    // If no Groq API key, return a demo response
    if (!groqClient) {
      console.log('❌ No Groq client - returning demo response');
      return `# 📋 Document Analysis

## 🔍 Document Overview
This appears to be a legal document that requires careful review. Since the AI service is not configured, here's a basic analysis based on the document content.

## 📝 Document Preview
\`\`\`
${text.substring(0, 500)}${text.length > 500 ? '...' : ''}
\`\`\`

## ⚠️ Important Notice
**AI Service Configuration Required**: To get a detailed AI-powered analysis, please configure your Groq API key in the server environment variables.

## 📄 General Document Guidance

### 🔍 What to Look For:
- **Party Information**: Names and contact details of all involved parties
- **Effective Dates**: When the agreement starts and ends
- **Payment Terms**: Any financial obligations or payment schedules
- **Termination Clauses**: How and when the agreement can be ended
- **Dispute Resolution**: How conflicts will be handled

### ⚖️ General Legal Advice:
- **Read Thoroughly**: Review all terms and conditions carefully
- **Understand Obligations**: Know what you're agreeing to do
- **Note Deadlines**: Pay attention to any time-sensitive requirements
- **Keep Records**: Maintain copies of all signed documents
- **Ask Questions**: Don't hesitate to clarify unclear terms

## 🎯 Next Steps
1. **Complete Review**: Read through the entire document carefully
2. **Note Concerns**: Write down any questions or unclear sections
3. **Professional Consultation**: Consider consulting with a legal professional
4. **Proper Configuration**: Set up the AI service for detailed analysis

---

**💡 Remember**: This is a basic overview. For detailed legal advice specific to your situation, consult with a qualified attorney.`;
    }

    console.log('🚀 Calling Groq API with model: llama-3.3-70b-versatile');
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: LEGAL_SIMPLIFICATION_PROMPT
        },
        {
          role: "user",
          content: `Please explain this legal document in simple terms:\n\n${text}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_completion_tokens: 2000,
      top_p: 1,
      stream: false
    });

    console.log('✅ Groq API response received');
    const result = completion.choices[0]?.message?.content || 'Unable to simplify the document.';
    console.log('📝 AI Response length:', result.length);
    console.log('📝 AI Response preview:', result.substring(0, 200) + '...');
    return result;
  } catch (error) {
    console.error('❌ AI Simplification Error:', error.message);
    console.error('❌ Full error:', error);
    
    // Return a fallback response instead of throwing an error
    return `**Document Analysis - AI Processing Error**

I encountered an issue while processing your document with AI: ${error.message}

**Document Content Preview:**
${text.substring(0, 800)}...

**General Legal Document Advice:**
- This appears to be a legal document that may contain important terms and conditions
- Please review all sections carefully
- Pay special attention to any dates, deadlines, or obligations mentioned
- Consider consulting with a legal professional for detailed advice

**Common Things to Look For:**
- Party names and contact information
- Effective dates and expiration dates
- Payment terms or financial obligations
- Cancellation or termination clauses
- Dispute resolution procedures

**Recommendation:** For a detailed analysis, please ensure the AI service is properly configured or consult with a legal professional.

**Error Details:** ${error.message}`;
  }
}