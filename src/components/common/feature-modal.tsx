'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogPortal 
} from '@/components/ui/dialog';
import { 
  Drawer, 
  DrawerContent, 
  DrawerTitle,
  DrawerHeader,
 // You might not need this if you control state externally
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FeatureModalProps } from '@/types';

export function FeatureModal({ 
  feature, 
  isOpen, 
  onClose, 
  children, 
  isMobile 
}: FeatureModalProps) {

  if (isMobile) {
    // ✨ Use the Drawer component for the mobile view
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between p-4 border-b">
            {/* The back button is less common in a drawer, consider removing */}
            <Button variant="ghost" size="sm" onClick={onClose} className="min-h-[44px] min-w-[44px] p-2" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DrawerTitle className="text-lg font-semibold truncate mx-4">
              {feature.title}
            </DrawerTitle>
            {/* An empty div to balance the header since drawers typically don't have a close 'X' button */}
            <div className="min-h-[44px] min-w-[44px]"></div>
          </DrawerHeader>
          <div className="flex justify-center py-2">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop modal remains the same, using Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                  {feature.title}
              </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
              {children}
              </div>
              <div className="flex justify-end mt-6 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="min-h-[44px]">
                  Back to Dashboard
              </Button>
              </div>
          </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}