/* eslint-disable react/no-unescaped-entities */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
//import { JokeResponse } from '@/types';

interface JokeViewerProps {
  className?: string;
}

export function JokeViewer({ className }: JokeViewerProps) {
  const [joke, setJoke] = useState<string>('');
  const [jokeType, setJokeType] = useState<'dad' | 'oneliner'>('dad');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [source, setSource] = useState<'api' | 'fallback' | ''>('');
  const [selectedReaction, setSelectedReaction] = useState<string>('');

  const generateJoke = async () => {
    setIsLoading(true);
    setError('');
    setSelectedReaction('');
    
    try {
      const response = await fetch('/api/joke');
      const result = await response.json();
      
      if (result.success && result.data) {
        setJoke(result.data.joke);
        setJokeType(result.data.type);
        setSource(result.data.source);
      } else {
        setError(result.error?.message || 'Failed to fetch joke');
      }
    } catch (err) {
      setError('Network error occurred while fetching joke');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    // Add a small animation delay to show the reaction
    setTimeout(() => setSelectedReaction(''), 2000);
  };

  // Generate initial joke on component mount
  React.useEffect(() => {
    generateJoke();
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Prepare for weaponized disappointment...
          <br />
          (Warning: May contain dad jokes)
        </p>
      </div>

      <Card className="p-6 min-h-[250px] flex flex-col justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading a fresh joke...
            </p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">
            <div className="text-4xl mb-4"></div>
            <p className="font-medium mb-2">Oops!</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : joke ? (
          <div className="text-center">
            <div className="text-4xl mb-4">
              {jokeType === 'dad' ? '👨‍👧‍👦' : '🎭'}
            </div>
            <blockquote className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed max-w-2xl mx-auto">
              {joke}
            </blockquote>
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {jokeType} joke
              </span>
              {source && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {source === 'api' ? 'External API' : 'Local Database'}
                  </span>
                </>
              )}
            </div>
            
            {/* Custom CSS Reaction Buttons */}
            <div className="flex justify-center gap-3 mb-4">
              <button
                onClick={() => handleReaction('laugh')}
                className={`reaction-button laugh ${selectedReaction === 'laugh' ? 'selected' : ''}`}
                aria-label="Laugh reaction"
              >
                <span className="reaction-icon"></span>
                <span className="reaction-label">HAHA nope</span>
              </button>
              
              <button
                onClick={() => handleReaction('groan')}
                className={`reaction-button groan ${selectedReaction === 'groan' ? 'selected' : ''}`}
                aria-label="Groan reaction"
              >
                <span className="reaction-icon"></span>
                <span className="reaction-label">Good Joke ,DAD. Now please stop at McDonald's</span>
              </button>
              
              <button
                onClick={() => handleReaction('love')}
                className={`reaction-button love ${selectedReaction === 'love' ? 'selected' : ''}`}
                aria-label="Love reaction"
              >
                <span className="reaction-icon"></span>
                <span className="reaction-label">Ouchy.exe</span>
              </button>
            </div>
            
            {selectedReaction && (
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium animate-pulse">
                Thanks for the reaction! 
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4"></div>
            <p>"Pun Me Again, I dare you..."!</p>
          </div>
        )}
      </Card>

      <div className="text-center">
        <Button
          onClick={generateJoke}
          disabled={isLoading}
          className="min-h-[44px] px-8 py-3 text-lg font-medium bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors duration-200 touch-manipulation"
          aria-label="Generate new joke"
        >
          {isLoading ? 'Loading...' : 'Pun me again!...I dare you!'}
        </Button>
      </div>

      {/* Custom CSS for reaction buttons */}
      <style jsx>{`
        .reaction-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          min-height: 44px;
          min-width: 80px;
          border: 2px solid transparent;
          border-radius: 12px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          color: #374151;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          touch-action: manipulation;
        }
        
        .reaction-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .reaction-button:active {
          transform: translateY(0);
        }
        
        .reaction-button.selected {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          transform: scale(1.05);
        }
        
        .reaction-button.laugh:hover {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #f59e0b;
        }
        
        .reaction-button.groan:hover {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-color: #ef4444;
        }
        
        .reaction-button.love:hover {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          border-color: #ec4899;
        }
        
        .reaction-icon {
          font-size: 18px;
          line-height: 1;
        }
        
        .reaction-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        @media (prefers-color-scheme: dark) {
          .reaction-button {
            background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
            color: #d1d5db;
          }
          
          .reaction-button.laugh:hover {
            background: linear-gradient(135deg, #92400e 0%, #78350f 100%);
            border-color: #f59e0b;
            color: #fbbf24;
          }
          
          .reaction-button.groan:hover {
            background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
            border-color: #ef4444;
            color: #f87171;
          }
          
          .reaction-button.love:hover {
            background: linear-gradient(135deg, #be185d 0%, #9d174d 100%);
            border-color: #ec4899;
            color: #f9a8d4;
          }
        }
      `}</style>
    </div>
  );
}