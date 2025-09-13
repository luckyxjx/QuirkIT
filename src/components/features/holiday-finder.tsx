/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HolidayFinderProps {
    className?: string;
}

interface HolidayData {
    name: string;
    description: string;
    date: string;
    source: 'api' | 'fallback';
}

export function HolidayFinder({ className }: HolidayFinderProps) {
    const [holiday, setHoliday] = useState<HolidayData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const findTodaysHoliday = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/holiday');
            const result = await response.json();

            if (result.success && result.data) {
                setHoliday(result.data);
            } else {
                setError(result.error?.message || 'Failed to find today\'s holiday');
            }
        } catch {
            setError('Network error occurred while fetching holiday information');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate initial holiday on component mount
    useState(() => {
        findTodaysHoliday();
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isToday = (dateString: string) => {
        const today = new Date().toISOString().split('T')[0];
        const holidayDate = new Date(dateString).toISOString().split('T')[0];
        return today === holidayDate;
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Holiday Finder
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Discover obscure holidays happening today
                </p>
            </div>

            <Card className="p-6 min-h-[250px] flex flex-col justify-center">
                {isLoading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Searching for celebrations...
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
                        <p className="font-medium mb-2">Holiday search failed!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : holiday ? (
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <div className="w-6 h-6 relative">
                                <div className="absolute inset-0 border-2 border-green-600 dark:border-green-400 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                                </div>
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                                    <div className="w-1 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {holiday.name}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            {holiday.description}
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <div className="w-4 h-4 flex items-center justify-center">
                                📅
                            </div>
                            <span>
                                {formatDate(holiday.date)}
                                {isToday(holiday.date) && (
                                    <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                        Today!
                                    </span>
                                )}
                            </span>
                        </div>
                        
                        {holiday.source && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Source: {holiday.source === 'api' ? 'Calendarific API' : 'Local Database'}
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
                        <p>Ready to discover today's celebration?</p>
                    </div>
                )}
            </Card>

            <div className="text-center">
                <Button
                    onClick={findTodaysHoliday}
                    disabled={isLoading}
                    className="min-h-[44px] px-8 py-3 text-lg font-medium bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors duration-200 touch-manipulation"
                    aria-label="Find today&apos;s holiday"
                >
                    {isLoading ? 'Searching...' : 'Find Holiday'}
                </Button>
            </div>
        </div>
    );
}