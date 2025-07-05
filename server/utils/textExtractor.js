import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import PDFParser from 'pdf2json';

// Extract text from DOCX files
export async function extractFromDocx(buffer) {
  try {
    console.log('📄 Extracting text from DOCX file...');
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    console.log('✅ DOCX text extracted, length:', text.length);
    return text;
  } catch (error) {
    console.error('❌ DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX file: ' + error.message);
  }
}

// Extract text from images using OCR
export async function extractFromImage(buffer) {
  try {
    console.log('🖼️ Extracting text from image using OCR...');
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => console.log('OCR:', m.status, m.progress)
    });
    const extractedText = text.trim();
    console.log('✅ Image text extracted, length:', extractedText.length);
    return extractedText;
  } catch (error) {
    console.error('❌ Image extraction error:', error);
    throw new Error('Failed to extract text from image: ' + error.message);
  }
}

// Extract text from PDF files
export async function extractFromPdf(buffer) {
  return new Promise((resolve, reject) => {
    try {
      console.log('📄 Extracting text from PDF file...');
      
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataError', (errData) => {
        console.error('❌ PDF parsing error:', errData.parserError);
        reject(new Error('Failed to parse PDF: ' + errData.parserError));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          let text = '';
          
          // Extract text from all pages
          if (pdfData.Pages && pdfData.Pages.length > 0) {
            pdfData.Pages.forEach(page => {
              if (page.Texts && page.Texts.length > 0) {
                page.Texts.forEach(textItem => {
                  if (textItem.R && textItem.R.length > 0) {
                    textItem.R.forEach(textRun => {
                      if (textRun.T) {
                        // Decode URI component to handle special characters
                        text += decodeURIComponent(textRun.T) + ' ';
                      }
                    });
                  }
                });
                text += '\n'; // Add line break between text blocks
              }
            });
          }
          
          text = text.trim();
          console.log('✅ PDF text extracted, length:', text.length);
          console.log('📊 PDF info - Pages:', pdfData.Pages ? pdfData.Pages.length : 0);
          
          if (!text || text.length < 10) {
            console.log('⚠️ PDF text extraction resulted in very short text, might be image-based PDF');
            resolve("This PDF appears to contain mostly images or scanned content. For better results, try converting it to text first or use an OCR tool.");
          } else {
            resolve(text);
          }
        } catch (parseError) {
          console.error('❌ Error processing PDF data:', parseError);
          reject(new Error('Failed to process PDF data: ' + parseError.message));
        }
      });
      
      // Parse the PDF buffer
      pdfParser.parseBuffer(buffer);
      
    } catch (error) {
      console.error('❌ PDF extraction error:', error);
      reject(new Error('Failed to extract text from PDF file: ' + error.message));
    }
  });
}