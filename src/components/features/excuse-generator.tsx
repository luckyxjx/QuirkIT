/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ExcuseGeneratorProps {
    className?: string;
}

export function ExcuseGenerator({ className }: ExcuseGeneratorProps) {
    const [excuse, setExcuse] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [source, setSource] = useState<'api' | 'fallback' | ''>('');

    const generateExcuse = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/excuse');
            const result = await response.json();

            if (result.success && result.data) {
                setExcuse(result.data.excuse);
                setSource(result.data.source);
            } else {
                setError(result.error?.message || 'Failed to generate excuse');
            }
        } catch (err) {
            setError('Network error occurred while fetching excuse');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate initial excuse on component mount
    useState(() => {
        generateExcuse();
    });

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Need an Excuse!! you evasive bitch. Go outside, have some fun
                </p>
            </div>

            <Card className="p-6 min-h-[200px] flex flex-col justify-center">
                {isLoading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                            okay fine here is your excuse...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 dark:text-red-400">
                        <div className="text-4xl mb-4">😅</div>
                        <p className="font-medium mb-2">Oops!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : excuse ? (
                    <div className="text-center">
                        <div className="text-4xl mb-4">🎭</div>
                        <blockquote className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 leading-relaxed">
                            "{excuse}"
                        </blockquote>
                        {source && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Source: {source === 'api' ? 'External API' : 'Local Database'}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="text-4xl mb-4">🤔</div>
                        <p>Press below to ruin your reputation with style!</p>
                    </div>
                )}
            </Card>

            <div className="text-center">
                <Button
                    onClick={generateExcuse}
                    disabled={isLoading}
                    className="min-h-[44px] px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 touch-manipulation"
                    aria-label="Generate new excuse"
                >
                    {isLoading ? 'Generating...' : 'Cooking Lies'}
                </Button>
            </div>
        </div>
    );
}