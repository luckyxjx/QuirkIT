'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuoteResponse } from '@/types';

interface QuoteDisplayProps {
  className?: string;
}

export function QuoteDisplay({ className }: QuoteDisplayProps) {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [source, setSource] = useState<'api' | 'fallback' | ''>('');

  const fetchQuote = async (targetDate?: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const url = targetDate ? `/api/quote?date=${targetDate}` : '/api/quote';
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success && result.data) {
        setQuote(result.data.quote);
        setAuthor(result.data.author);
        setDate(result.data.date);
        setSource(result.data.source || 'fallback');
      } else {
        setError(result.error?.message || 'Failed to fetch quote');
      }
    } catch (err) {
      setError('Network error occurred while fetching quote');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch today's quote on component mount
  useEffect(() => {
    fetchQuote();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Quote of the Day
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Daily inspiration and wisdom to brighten your day
        </p>
      </div>

      <Card className="p-8 min-h-[300px] flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading today's wisdom...
            </p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">
            <div className="text-4xl mb-4">📚</div>
            <p className="font-medium mb-2">Oops!</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : quote ? (
          <div className="text-center">
            <div className="text-5xl mb-6 text-blue-600 dark:text-blue-400">
              "
            </div>
            <blockquote className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed max-w-3xl mx-auto italic">
              {quote}
            </blockquote>
            <div className="text-5xl mb-6 text-blue-600 dark:text-blue-400 rotate-180">
              "
            </div>
            
            <div className="space-y-3">
              <cite className="text-lg font-semibold text-blue-700 dark:text-blue-300 not-italic">
                — {author}
              </cite>
              
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {formatDate(date)}
                </span>
                {source && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {source === 'api' ? 'External API' : 'Local Database'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">💭</div>
            <p>Click the button below to get today's quote! or whatever you motivated shithead</p>
          </div>
        )}
      </Card>

      <div className="text-center space-y-3">
        <Button
          onClick={() => fetchQuote()}
          disabled={isLoading}
          className="min-h-[44px] px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 touch-manipulation"
          aria-label="Get today's quote"
        >
          {isLoading ? 'Loading...' : 'Get Today\'s Quote'}
        </Button>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Its the same "Quote" dude , get a life , come back tomorrow or watever!
        </p>
      </div>

      {/* Custom CSS for quote styling */}
      <style jsx>{`
        blockquote {
          position: relative;
        }
        
        blockquote::before,
        blockquote::after {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          opacity: 0.1;
        }
        
        blockquote::before {
          top: -15px;
          left: -15px;
        }
        
        blockquote::after {
          bottom: -15px;
          right: -15px;
        }
        
        @media (prefers-color-scheme: dark) {
          blockquote::before,
          blockquote::after {
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
          }
        }
      `}</style>
    </div>
  );
}