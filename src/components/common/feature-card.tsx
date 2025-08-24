'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeatureCard as FeatureCardType } from '@/types';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  feature: FeatureCardType;
  onClick: () => void;
}

// Custom CSS icon components
const FeatureIcon = ({ iconType }: { iconType: string }) => {
  const iconClasses = {
    'excuse-icon': 'excuse-generator-icon',
    'joke-icon': 'joke-viewer-icon', 
    'quote-icon': 'quote-of-day-icon',
    'thought-icon': 'shower-thoughts-icon',
    'holiday-icon': 'holiday-finder-icon',
    'drink-icon': 'drink-recipes-icon',
    'timer-icon': 'productivity-timer-icon',
    'spinner-icon': 'decision-spinner-icon',
    'compliment-icon': 'compliment-machine-icon'
  };

  return (
    <div className={cn(
      "w-10 h-10 rounded-lg flex items-center justify-center relative",
      "bg-gradient-to-br from-primary/20 to-primary/10",
      "border border-primary/20",
      iconClasses[iconType as keyof typeof iconClasses] || 'default-icon'
    )}>
      {/* Custom CSS icons using pseudo-elements and borders */}
      <div className="feature-icon-inner" />
    </div>
  );
};

export function FeatureCard({ feature, onClick }: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "h-full transition-all duration-200 cursor-pointer group",
        "hover:shadow-lg hover:scale-[1.02] hover:border-primary/30",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        "min-h-[200px] touch-manipulation" // Ensure minimum touch target area
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open ${feature.title} feature`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <FeatureIcon iconType={feature.icon} />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              {feature.title}
            </CardTitle>

          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-4 line-clamp-2">
          {feature.description}
        </CardDescription>
        <Button 
          variant="default"
          size="sm" 
          className={cn(
            "w-full min-h-[44px] touch-manipulation",
            "transition-all duration-200",
            "group-hover:bg-primary/90"
          )}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            onClick();
          }}
        >
          Open Feature
        </Button>
      </CardContent>
    </Card>
  );
}