import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportGenerating: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Increase maximum wait time to 10 minutes (120 attempts × 5 seconds)
  const MAX_ATTEMPTS = 120;

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      console.log(`Checking report status (attempt ${attempts + 1}/${MAX_ATTEMPTS})...`);
      
      const response = await fetch('/api/questionnaire/report-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 504) {
          // If API returns "not found" or "timeout", just keep polling
          // These are common during long-running processes
          console.log('Status endpoint temporarily unavailable, continuing to poll...');
          continuePolling();
          return;
        }
        
        // Only consider it an error if we get a real error response
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to fetch status');
      }

      const data = await response.json();
      console.log('Report status:', data);

      // Update progress if available
      if (data.progress) {
        setProgress(data.progress);
      } else {
        // Estimate progress based on attempts (0-90%)
        const estimatedProgress = Math.min(90, Math.floor((attempts / MAX_ATTEMPTS) * 100));
        setProgress(estimatedProgress);
      }

      // Check if status is no longer "Analyzing"
      if (data.status && data.status !== 'Analyzing') {
        console.log('Report generation complete, navigating to dashboard');
        setProgress(100);
        setLoading(false);
        // Add a slight delay before redirecting for better UX
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        continuePolling();
      }
    } catch (error) {
      console.error('Error checking status:', error);
      
      // Don't immediately show error - retry a few times first
      if (attempts > 5) {
        setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
      } else {
        continuePolling();
      }
    }
  };

  const continuePolling = () => {
    // Continue polling if we haven't reached max attempts
    if (attempts < MAX_ATTEMPTS) {
      setAttempts(prev => prev + 1);
      setTimeout(checkStatus, 5000); // Poll every 5 seconds
    } else {
      // Max attempts reached, but don't show error - the report may still be processing
      setError('Your report is still being generated. You can wait or check your dashboard.');
      setLoading(false);
    }
  };

  // Function to manually retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setAttempts(0);
    checkStatus();
  };

  useEffect(() => {
    // Start checking after a 2-second delay to allow backend initialization
    const timer = setTimeout(() => {
      checkStatus();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []); // Only run on mount

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error ? 'Report Generation Status' : 'Generating Your Career Report'}
        </h2>
        
        {error ? (
          <>
            <p className="text-amber-600 mb-4">{error}</p>
            <p className="text-gray-600 mb-6">
              Your answers have been saved. The report generation continues in the background.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Check Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {loading
                ? 'Please wait while we analyze your answers and generate your personalized career report...'
                : 'Your report is ready! Redirecting to your dashboard...'}
            </p>
            
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {progress < 100 ? `Approximately ${progress}% complete` : 'Complete!'}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              {loading && (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4" />
              )}
              {attempts > 0 && loading && (
                <p className="text-sm text-gray-500">
                  This may take several minutes. Feel free to leave this page open while we work.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportGenerating;