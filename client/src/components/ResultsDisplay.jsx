import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ResultsDisplay = ({ results, language, onReset }) => {
  const [showTranslated, setShowTranslated] = useState(language !== 'en');
  const [showOriginal, setShowOriginal] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handleDownload = (format = 'txt') => {
    const content = showTranslated && results.translated ? results.translated : results.simplified;
    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.filename}_simplified.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const content = showTranslated && results.translated ? results.translated : results.simplified;
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const displayContent = showTranslated && results.translated ? results.translated : results.simplified;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with enhanced glassmorphic design */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Document Analysis Complete
              </h2>
              <p className="text-white/70 flex items-center text-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {results.filename}
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-3">
            {results.translated && (
              <button
                onClick={() => setShowTranslated(!showTranslated)}
                className="glass-button text-white hover:text-gray-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {showTranslated ? 'Show English' : 'Show Translation'}
              </button>
            )}
            <button
              onClick={handleCopy}
              className="glass-button text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copySuccess || 'Copy'}
            </button>
            <button
              onClick={() => handleDownload('md')}
              className="glass-button-primary text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          </div>
        </div>

        {/* Enhanced toggle buttons */}
        <div className="flex space-x-2 glass-card p-2 border-white/30">
          <button
            onClick={() => setShowOriginal(false)}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              !showOriginal
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Simplified Explanation</span>
            </div>
          </button>
          <button
            onClick={() => setShowOriginal(true)}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              showOriginal
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Original Text</span>
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Content Display */}
      <div className="glass-card overflow-hidden">
        {showOriginal ? (
          <div>
            <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 px-8 py-6 border-b border-white/20">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Original Document Text
              </h3>
            </div>
            <div className="p-8">
              <div className="glass-card p-8 border-white/20 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-white/80 font-mono leading-relaxed">
                  {results.originalText}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 px-8 py-6 border-b border-blue-400/30">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {showTranslated && results.translated ? 'Translated Explanation' : 'Simplified Explanation'}
              </h3>
            </div>
            <div className="p-8">
              <div className="markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/20" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mb-4 mt-8" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-white mb-3 mt-6" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-white mb-2 mt-4" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-white/80 leading-relaxed text-lg" {...props} />,
                    ul: ({node, ...props}) => <ul className="mb-6 ml-6 space-y-2 list-disc" {...props} />,
                    ol: ({node, ...props}) => <ol className="mb-6 ml-6 space-y-2 list-decimal" {...props} />,
                    li: ({node, ...props}) => <li className="text-white/80 leading-relaxed" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-white/90" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-400 pl-6 py-3 my-6 glass-card bg-blue-500/10 text-white/90 italic" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline 
                        ? <code className="bg-white/20 text-white px-2 py-1 rounded text-sm font-mono" {...props} />
                        : <code className="block glass-card p-6 rounded-xl overflow-x-auto my-6 text-sm font-mono text-white/90" {...props} />,
                    pre: ({node, ...props}) => <pre className="glass-card p-6 rounded-xl overflow-x-auto my-6" {...props} />,
                    table: ({node, ...props}) => <table className="w-full border-collapse border border-white/30 my-6 glass-card" {...props} />,
                    th: ({node, ...props}) => <th className="bg-white/10 border border-white/30 px-4 py-3 text-left font-semibold text-white" {...props} />,
                    td: ({node, ...props}) => <td className="border border-white/30 px-4 py-3 text-white/80" {...props} />,
                    hr: ({node, ...props}) => <hr className="border-white/30 my-8" {...props} />,
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Action Section */}
      <div className="glass-card p-8 text-center">
        <div className="flex justify-center space-x-6">
          <button
            onClick={onReset}
            className="glass-button-primary text-white px-8 py-4 text-lg font-semibold"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Process Another Document
          </button>
        </div>
        <p className="text-white/60 text-lg mt-4">
          Need help with another legal document? Upload a new file to get started.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;