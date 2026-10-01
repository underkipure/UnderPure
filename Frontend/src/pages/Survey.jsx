import React, { useState } from 'react';
import { useSiteSettingsStore } from '../store/siteSettingsStore';
import { submitSurvey } from '../lib/api';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Survey = () => {
  const { storeName } = useSiteSettingsStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recommend_score: null,
    improvement_feedback: '',
    three_words: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 4;

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  
  const handleScoreSelect = (score) => {
    setFormData((prev) => ({ ...prev, recommend_score: score }));
    setTimeout(handleNext, 300); // auto-advance after selecting score
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.email) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await submitSurvey(formData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit survey.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <SEO title={`Survey - ${storeName}`} />
        <div className="bg-white shadow-xl rounded max-w-2xl w-full p-8 text-center border border-gray-100">
          <h1 className="font-serif text-3xl mb-4">Thank you for taking our survey</h1>
          <p className="text-gray-600 mb-8">Your feedback is incredibly valuable to us.</p>
          <Link to="/" className="bg-black text-white px-8 py-3 rounded text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <SEO title={`Survey - ${storeName}`} />
      <div className="bg-white shadow-xl rounded max-w-2xl w-full border border-gray-100">
        
        {/* Header */}
        <div className="text-center py-6 border-b border-gray-100">
          <h1 className="font-serif text-3xl tracking-widest uppercase">{storeName}</h1>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-8 text-center">
                On a scale from 0 to 10, how likely are you to recommend {storeName} to a friend or colleague?
              </h2>
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleScoreSelect(num)}
                    className={`w-10 h-10 border transition-all ${formData.recommend_score === num ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 hover:border-gray-400 text-gray-700'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 max-w-lg mx-auto w-full px-2">
                <span>Very Unlikely</span>
                <span>Very Likely</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6 text-center">
                What would improve your experience with {storeName}?
              </h2>
              <textarea
                value={formData.improvement_feedback}
                onChange={(e) => setFormData({ ...formData, improvement_feedback: e.target.value })}
                className="w-full border-2 border-black rounded-lg p-4 h-32 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                placeholder="Share your thoughts..."
              />
              <div className="mt-6 flex justify-center">
                <button onClick={handleNext} className="bg-black text-white px-10 py-3 rounded font-bold hover:bg-gray-800 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6 text-center">
                Describe yourself in three words.
              </h2>
              <textarea
                value={formData.three_words}
                onChange={(e) => setFormData({ ...formData, three_words: e.target.value })}
                className="w-full border-2 border-black rounded-lg p-4 h-32 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                placeholder="e.g. Creative, Ambitious, Friendly"
              />
              <div className="mt-6 flex justify-center">
                <button onClick={handleNext} className="bg-black text-white px-10 py-3 rounded font-bold hover:bg-gray-800 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-2 text-center">
                What's your email address?
              </h2>
              <p className="text-sm text-gray-500 mb-4 text-center">Enter your email</p>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 border-black rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="email@example.com"
                />
                <p className="text-xs text-gray-400 mt-6 text-center">
                  By continuing you agree to our <Link to="/terms" className="underline">Terms and Conditions</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
                </p>
                <div className="mt-6 flex justify-center">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-black text-white px-10 py-3 rounded font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer Progress */}
        <div className="pb-8 pt-4 flex flex-col items-center">
          <div className="w-32 h-1 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{step} of {totalSteps}</span>
        </div>

      </div>
    </div>
  );
};

export default Survey;
