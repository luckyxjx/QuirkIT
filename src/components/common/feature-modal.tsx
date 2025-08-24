'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { FeatureModalProps } from '@/types';
import { cn } from '@/lib/utils';

export function FeatureModal({ 
  feature, 
  isOpen, 
  onClose, 
  children, 
  isMobile, 
  orientation 
}: FeatureModalProps) {
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle swipe-to-close functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !startY || !isDragging) return;
    
    const currentY = e.touches[0].clientY;
    setCurrentY(currentY);
    
    // Only allow downward swipes to close
    const deltaY = currentY - startY;
    if (deltaY > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${Math.min(deltaY, 100)}px)`;
      modalRef.current.style.opacity = `${Math.max(1 - deltaY / 200, 0.5)}`;
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile || !startY || !currentY || !isDragging) {
      resetSwipe();
      return;
    }

    const deltaY = currentY - startY;
    
    // Close modal if swiped down more than 100px
    if (deltaY > 100) {
      onClose();
    }
    
    resetSwipe();
  };

  const resetSwipe = () => {
    setStartY(null);
    setCurrentY(null);
    setIsDragging(false);
    
    if (modalRef.current) {
      modalRef.current.style.transform = '';
      modalRef.current.style.opacity = '';
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, isMobile]);

  if (isMobile) {
    // Mobile full-screen modal
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          ref={modalRef}
          className={cn(
            "fixed inset-0 z-50 bg-background p-0 m-0 max-w-none h-full w-full rounded-none border-0",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            orientation === 'landscape' && "overflow-y-auto"
          )}
          showCloseButton={false}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <DialogTitle className="text-lg font-semibold truncate mx-4">
              {feature.title}
            </DialogTitle>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Swipe indicator */}
          <div className="flex justify-center py-2 bg-background/95">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop modal
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {feature.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {children}
        </div>

        {/* Desktop navigation */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="min-h-[44px]"
          >
            Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}