/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DrinkRecipeProps {
    className?: string;
}

interface DrinkData {
    name: string;
    ingredients: string[];
    instructions: string[];
    image?: string;
    source: 'api' | 'fallback';
}

export function DrinkRecipe({ className }: DrinkRecipeProps) {
    const [drink, setDrink] = useState<DrinkData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [imageError, setImageError] = useState(false);

    const getRandomDrink = async () => {
        setIsLoading(true);
        setError('');
        setImageError(false);

        try {
            const response = await fetch('/api/drink');
            const result = await response.json();

            if (result.success && result.data) {
                setDrink(result.data);
            } else {
                setError(result.error?.message || 'Failed to fetch drink recipe');
            }
        } catch {
            setError('Network error occurred while fetching drink recipe');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate initial drink on component mount
    useState(() => {
        getRandomDrink();
    });

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Drink Recipes
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Discover delicious cocktails and mocktails
                </p>
            </div>

            <Card className="p-6 min-h-[400px] flex flex-col">
                {isLoading ? (
                    <div className="text-center flex-1 flex flex-col justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Mixing up something special...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 dark:text-red-400 flex-1 flex flex-col justify-center">
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
                        <p className="font-medium mb-2">Bar is closed!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : drink ? (
                    <div className="flex-1 flex flex-col">
                        {/* Drink Image */}
                        {drink.image && !imageError && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={drink.image}
                                    alt={drink.name}
                                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                                    onError={handleImageError}
                                />
                            </div>
                        )}

                        {/* Drink Name */}
                        <div className="text-center mb-4">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <div className="w-6 h-6 relative">
                                    <div className="absolute inset-0 border-2 border-blue-600 dark:border-blue-400 rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {drink.name}
                            </h3>
                        </div>

                        <div className="flex-1 space-y-4">
                            {/* Ingredients */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                    <span className="text-lg">🥤</span>
                                    Ingredients
                                </h4>
                                <ul className="space-y-1">
                                    {drink.ingredients.map((ingredient, index) => (
                                        <li 
                                            key={index}
                                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                                        >
                                            <span className="text-blue-500 mt-1">•</span>
                                            <span>{ingredient}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Instructions */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                    <span className="text-lg">📝</span>
                                    Instructions
                                </h4>
                                <ol className="space-y-2">
                                    {drink.instructions.map((instruction, index) => (
                                        <li 
                                            key={index}
                                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-3"
                                        >
                                            <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </span>
                                            <span>{instruction}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* Source indicator */}
                        {drink.source && (
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Source: {drink.source === 'api' ? 'TheCocktailDB API' : 'Local Recipe Collection'}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 flex-1 flex flex-col justify-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-current rounded-full relative">
                                <div className="absolute top-1 left-1 w-1 h-1 bg-current rounded-full"></div>
                                <div className="absolute top-1 right-1 w-1 h-1 bg-current rounded-full"></div>
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-current rounded-full"></div>
                            </div>
                        </div>
                        <p>Ready to mix something delicious?</p>
                    </div>
                )}
            </Card>

            <div className="text-center">
                <Button
                    onClick={getRandomDrink}
                    disabled={isLoading}
                    className="min-h-[44px] px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 touch-manipulation"
                    aria-label="Get random drink recipe"
                >
                    {isLoading ? 'Mixing...' : 'Mix It Up'}
                </Button>
            </div>
        </div>
    );
}