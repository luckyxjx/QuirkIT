/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ShowerThoughtProps {
    className?: string;
}

export function ShowerThought({ className }: ShowerThoughtProps) {
    const [thought, setThought] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [source, setSource] = useState<'api' | 'fallback' | ''>('');

    const generateThought = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/showerthought');
            const result = await response.json();

            if (result.success && result.data) {
                setThought(result.data.thought);
                setSource(result.data.source);
            } else {
                setError(result.error?.message || 'Failed to generate shower thought');
            }
        } catch (err) {
            setError('Network error occurred while fetching shower thought');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate initial thought on component mount
    useState(() => {
        generateThought();
    });

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Shower Thoughts
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Deep thoughts from the depths of the mind
                </p>
            </div>

            <Card className="p-6 min-h-[200px] flex flex-col justify-center">
                {isLoading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Contemplating existence...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 dark:text-red-400">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-current rounded-full relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                </div>
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                    <div className="w-1 h-2 bg-current rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <p className="font-medium mb-2">Brain fog detected!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : thought ? (
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <div className="w-6 h-6 relative">
                                <div className="absolute inset-0 border-2 border-purple-600 dark:border-purple-400 rounded-full"></div>
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                                    <div className="w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                                </div>
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                    <div className="w-2 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <blockquote className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 leading-relaxed italic">
                            "{thought}"
                        </blockquote>
                        {source && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Source: {source === 'api' ? 'External API' : 'Local Database'}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-current rounded-full relative">
                                <div className="absolute top-1 left-1 w-1 h-1 bg-current rounded-full"></div>
                                <div className="absolute top-1 right-1 w-1 h-1 bg-current rounded-full"></div>
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-current rounded-full"></div>
                            </div>
                        </div>
                        <p>Ready to blow your mind?</p>
                    </div>
                )}
            </Card>

            <div className="text-center">
                <Button
                    onClick={generateThought}
                    disabled={isLoading}
                    className="min-h-[44px] px-8 py-3 text-lg font-medium bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors duration-200 touch-manipulation"
                    aria-label="Generate new shower thought"
                >
                    {isLoading ? 'Thinking...' : 'Mind = Blown'}
                </Button>
            </div>
        </div>
    );
}