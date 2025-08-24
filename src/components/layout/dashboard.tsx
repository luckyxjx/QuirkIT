'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { FeatureCard } from '@/components/common/feature-card';
import { FeatureModal } from '@/components/common/feature-modal';
import { ExcuseGenerator, JokeViewer, QuoteDisplay } from '@/components/features';
import { FeatureCard as FeatureCardType } from '@/types';

// Feature data - this will be the source of truth for all features
const FEATURES: FeatureCardType[] = [
    // Phase 1 (MVP) Features
    {
        id: 'excuse-generator',
        title: 'Excuse Generator',
        description: 'Generate random funny excuses for any situation',
        icon: 'excuse-icon',
        category: 'mvp',
        enabled: true
    },
    {
        id: 'joke-viewer',
        title: 'Joke Viewer',
        description: 'Enjoy random dad jokes and one-liners',
        icon: 'joke-icon',
        category: 'mvp',
        enabled: true
    },
    {
        id: 'quote-of-day',
        title: 'Quote of the Day',
        description: 'Daily motivational, sarcastic, or meme-worthy quotes',
        icon: 'quote-icon',
        category: 'mvp',
        enabled: true
    },

    // Phase 2 (Expansion) Features
    {
        id: 'shower-thoughts',
        title: 'Shower Thoughts',
        description: 'Random deep or funny thoughts to ponder',
        icon: 'thought-icon',
        category: 'expansion',
        enabled: false
    },
    {
        id: 'holiday-finder',
        title: 'Holiday Finder',
        description: 'Discover today\'s obscure holidays and celebrations',
        icon: 'holiday-icon',
        category: 'expansion',
        enabled: false
    },
    {
        id: 'drink-recipes',
        title: 'Drink Recipes',
        description: 'Random cocktail and mocktail recipes to try',
        icon: 'drink-icon',
        category: 'expansion',
        enabled: false
    },

    // Phase 3 (Advanced) Features
    {
        id: 'productivity-timer',
        title: 'Productivity Timer',
        description: 'Pomodoro timer with weird break suggestions',
        icon: 'timer-icon',
        category: 'advanced',
        enabled: false
    },
    {
        id: 'decision-spinner',
        title: 'Decision Spinner',
        description: 'Spin the wheel to make random choices',
        icon: 'spinner-icon',
        category: 'advanced',
        enabled: false
    },
    {
        id: 'compliment-machine',
        title: 'Compliment Machine',
        description: 'Send and receive anonymous compliments',
        icon: 'compliment-icon',
        category: 'advanced',
        enabled: false
    }
];

export function Dashboard() {
    const [selectedFeature, setSelectedFeature] = useState<FeatureCardType | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

    // Handle responsive breakpoints and device detection
    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768); // md breakpoint
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        window.addEventListener('orientationchange', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
            window.removeEventListener('orientationchange', checkDevice);
        };
    }, []);

    const handleFeatureClick = (feature: FeatureCardType) => {
        if (feature.enabled) {
            setSelectedFeature(feature);
        }
    };

    const handleCloseModal = () => {
        setSelectedFeature(null);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome to Quirkit!</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Dumb on the Outside, Useful on the Inside...(that's what she....nvm)
                    </p>
                </div>

                {/* Responsive Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {FEATURES.map((feature) => (
                        <FeatureCard
                            key={feature.id}
                            feature={feature}
                            onClick={() => handleFeatureClick(feature)}
                        />
                    ))}
                </div>

                {/* Feature Modal */}
                {selectedFeature && (
                    <FeatureModal
                        feature={selectedFeature}
                        isOpen={!!selectedFeature}
                        onClose={handleCloseModal}
                        isMobile={isMobile}
                        orientation={orientation}
                    >
                        {selectedFeature.id === 'excuse-generator' ? (
                            <ExcuseGenerator />
                        ) : selectedFeature.id === 'joke-viewer' ? (
                            <JokeViewer />
                        ) : selectedFeature.id === 'quote-of-day' ? (
                            <QuoteDisplay />
                        ) : (
                            <div className="text-center py-8">
                                <h3 className="text-xl font-semibold mb-4">{selectedFeature.title}</h3>
                                <p className="text-muted-foreground mb-6">{selectedFeature.description}</p>
                                <p className="text-sm text-muted-foreground">
                                    This feature is coming soon! Stay tuned for updates.
                                </p>
                            </div>
                        )}
                    </FeatureModal>
                )}
            </div>
        </DashboardLayout>
    );
}