import React from 'react';

const ProcessingStatus = ({ currentStep }) => {
  const steps = [
    { id: 'uploading', label: 'Uploading document', icon: '📤', color: 'from-blue-400 to-blue-600' },
    { id: 'extracting', label: 'Extracting text', icon: '📝', color: 'from-purple-400 to-purple-600' },
    { id: 'simplifying', label: 'Simplifying legal language', icon: '🤖', color: 'from-pink-400 to-pink-600' },
    { id: 'translating', label: 'Translating to your language', icon: '🌐', color: 'from-green-400 to-green-600' },
  ];

  const getStepStatus = (stepId) => {
    if (currentStep === stepId) return 'current';
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    return stepIndex < currentIndex ? 'completed' : 'pending';
  };

  return (
    <div className="glass-card p-10 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
          <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          Processing Your Document
        </h2>
        <p className="text-white/70 text-lg">
          Please wait while we analyze and simplify your legal document
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          return (
            <div
              key={step.id}
              className={`glass-card p-6 transition-all duration-500 ${
                status === 'current'
                  ? 'border-white/40 bg-white/15 pulse-glow'
                  : status === 'completed'
                  ? 'border-green-400/50 bg-green-500/10 success-glow'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-6 ${
                  status === 'current' || status === 'completed'
                    ? `bg-gradient-to-br ${step.color} shadow-lg`
                    : 'bg-white/10'
                }`}>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-lg ${
                    status === 'current'
                      ? 'text-white'
                      : status === 'completed'
                      ? 'text-green-300'
                      : 'text-white/60'
                  }`}>
                    {step.label}
                  </div>
                  {status === 'current' && (
                    <div className="text-white/70 text-sm mt-1">
                      Processing...
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  {status === 'current' && (
                    <div className="spinner w-8 h-8"></div>
                  )}
                  {status === 'completed' && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {status === 'pending' && (
                    <div className="w-8 h-8 border-2 border-white/30 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="text-white/60 text-sm">
          This usually takes 30-60 seconds
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;