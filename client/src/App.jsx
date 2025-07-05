import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import LanguageSelector from './components/LanguageSelector';
import ProcessingStatus from './components/ProcessingStatus';
import ResultsDisplay from './components/ResultsDisplay';
import { processDocument } from './services/api';

function App() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResults(null);
    setError('');
  };

  const handleProcess = async () => {
    if (!file) return;

    setProcessing(true);
    setError('');
    setResults(null);

    try {
      const result = await processDocument(file, language, setCurrentStep);
      setResults(result);
    } catch (err) {
      setError(err.message || 'An error occurred while processing the document');
    } finally {
      setProcessing(false);
      setCurrentStep('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    setError('');
    setProcessing(false);
    setCurrentStep('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  LegalEase
                </h1>
                <p className="text-white/70 text-sm font-medium">Legal Document Simplifier</p>
              </div>
            </div>
            {(file || results) && (
              <button
                onClick={handleReset}
                className="glass-button text-white hover:text-gray-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!results && !processing && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="glass-card p-12 mb-8">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
                  Understand Your Legal Documents
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Upload any legal document and get a clear, simple explanation in your preferred language.
                  <span className="block mt-2 text-lg text-white/60">No legal expertise required.</span>
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-10">
              <FileUpload onFileSelect={handleFileSelect} selectedFile={file} />
              
              {file && (
                <>
                  <LanguageSelector value={language} onChange={setLanguage} />
                  
                  <div className="text-center">
                    <button
                      onClick={handleProcess}
                      className="glass-button-primary text-lg px-12 py-4 text-white font-semibold"
                      disabled={processing}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Simplify Document
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Processing Status */}
        {processing && (
          <ProcessingStatus currentStep={currentStep} />
        )}

        {/* Results */}
        {results && (
          <ResultsDisplay 
            results={results} 
            language={language}
            onReset={handleReset}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="glass-card-error text-center p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-red-300 font-medium mb-2 text-lg">Something went wrong</div>
            <div className="text-red-200 mb-6">{error}</div>
            <button
              onClick={handleReset}
              className="glass-button-primary text-white"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-white/5 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 LegalEase. Making legal documents accessible to everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;