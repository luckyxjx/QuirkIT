/* eslint-disable react/no-unescaped-entities */

'use client';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { FeatureCard } from '@/components/common/feature-card';
import { FeatureModal } from '@/components/common/feature-modal';
import { ExcuseGenerator, JokeViewer, QuoteDisplay, ShowerThought } from '@/components/features';
import { FeatureCard as FeatureCardType } from '@/types';

// Feature data - this will be the source of truth for all features
const FEATURES: FeatureCardType[] = [
    // Phase 1 (MVP) Features
    {
        id: 'excuse-generator',
        title: 'Excuse-O-Matic 3000',
        description: 'Generate random funny excuses for any situation',
        icon: 'excuse-icon',
        category: 'mvp',
        enabled: true
    },
    {
        id: 'joke-viewer',
        title: 'Joke Machine',
        description: 'Unfunny since forever. Groan responsibly',
        icon: 'joke-icon',
        category: 'mvp',
        enabled: true
    },
    {
        id: 'quote-of-day',
        title: 'Deep Fried Wisdom',
        description: 'Quotes so inspiring they’ll make you quit',
        icon: 'quote-icon',
        category: 'mvp',
        enabled: true
    },

    // Phase 2 (Expansion) Features
    {
        id: 'shower-thoughts',
        title: 'Shower Thoughts',
        description: 'why you looking here creep , just go take a shower',
        icon: 'thought-icon',
        category: 'expansion',
        enabled: true
    },
    {
        id: 'holiday-finder',
        title: 'Holiday Finder',
        description: 'i knew you were looking for a reason to take a day off',
        icon: 'holiday-icon',
        category: 'expansion',
        enabled: false
    },
    {
        id: 'drink-recipes',
        title: 'Drink Recipes',
        description: 'OHHH you drunk bastard, here are some recipes',
        icon: 'drink-icon',
        category: 'expansion',
        enabled: false
    },

    // Phase 3 (Advanced) Features
    {
        id: 'productivity-timer',
        title: 'Productivity Timer',
        description: 'Track minutes, lose hours, question life choices',
        icon: 'timer-icon',
        category: 'advanced',
        enabled: false
    },
    {
        id: 'decision-spinner',
        title: 'Decision Spinner',
        description: 'i knew you were indecisive, so here is a spinner',
        icon: 'spinner-icon',
        category: 'advanced',
        enabled: false
    },
    {
        id: 'compliment-machine',
        title: 'Compliment Machine',
        description: 'Generate random compliments to boost your ego',
        icon: 'compliment-icon',
        category: 'advanced',
        enabled: false
    }
];

export function Dashboard() {
    const [selectedFeature, setSelectedFeature] = useState<FeatureCardType | null>(null);

    // Step 2: Call the hook to get the isMobile boolean.
    // This single line replaces the entire useEffect block.
    const isMobile = useIsMobile();

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
                        isMobile={isMobile} // Pass the value from our hook
                        orientation={'portrait'} // Using a placeholder for orientation
                    >
                        {selectedFeature.id === 'excuse-generator' ? (
                            <ExcuseGenerator />
                        ) : selectedFeature.id === 'joke-viewer' ? (
                            <JokeViewer />
                        ) : selectedFeature.id === 'quote-of-day' ? (
                            <QuoteDisplay />
                        ) : selectedFeature.id === 'shower-thoughts' ? (
                            <ShowerThought />
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
