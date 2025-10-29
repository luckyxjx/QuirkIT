/* eslint-disable react/no-unescaped-entities */

'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { X, Plus } from 'lucide-react';

interface DecisionSpinnerProps {
  className?: string;
}

export function DecisionSpinner({ className }: DecisionSpinnerProps) {
  const [choices, setChoices] = useState<string[]>(['Option 1', 'Option 2']);
  const [newChoice, setNewChoice] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [currentRotation, setCurrentRotation] = useState<number>(0); // we keep this small (0..360)
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const maxChoices = 5;

  // reset wheel immediately when choices change (only if not currently spinning)
  useEffect(() => {
    if (!isSpinning) {
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = `rotate(0deg)`;
      }
      setCurrentRotation(0);
      setResult('');
      setError('');
    }
  }, [choices]);

  const addChoice = () => {
    if (newChoice.trim() && choices.length < maxChoices) {
      setChoices([...choices, newChoice.trim()]);
      setNewChoice('');
    }
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      setChoices(choices.filter((_, i) => i !== index));
    }
  };

  const updateChoice = (index: number, value: string) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const normalize = (angle: number) => ((angle % 360) + 360) % 360;

  // Local spin - deterministic mapping from selectedIndex -> visual rotation
  const spinWheel = () => {
    if (choices.length < 2) {
      setError('Need at least 2 choices to spin');
      return;
    }

    setIsSpinning(true);
    setError('');
    setResult('');

    // Immediately reset any transition and snap wheel to baseline (0deg) so we always compute from known baseline.
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      // Snap to 0 quickly — ensures consistent mapping independent of previous spins
      wheelRef.current.style.transform = `rotate(0deg)`;
      // Force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      wheelRef.current.offsetHeight;
    }

    // local selection (random) — replace with API if you need a server-determined result,
    // but the rotation math below will work with any selectedIndex.
    const selectedIndex = Math.floor(Math.random() * choices.length);
    const selectedChoice = choices[selectedIndex];

    // Randomize animation params (or fix them if you prefer)
    const spinDuration = Math.floor(Math.random() * 2000) + 3000; // 3000-5000ms
    const rotations = Math.floor(Math.random() * 5) + 5; // 5-9 full rotations

    const segmentAngle = 360 / choices.length;

    // centerAngle: where the segment's center sits in initial wheel coords
    // initial centerAngle = index*segment - 90 + segment/2 (because we draw starting at -90deg)
    const centerAngle = selectedIndex * segmentAngle - 90 + segmentAngle / 2;

    // We want (centerAngle + finalRotation) % 360 === -90 (top pointer).
    // Solve finalRotation ≡ -90 - centerAngle  (mod 360).
    // Normalize into 0..360 for positive rotation.
    const targetAngle = normalize(-90 - centerAngle);

    // Add full rotations for the animation so it spins nicely
    const totalRotation = rotations * 360 + targetAngle;

    // Apply the CSS transition + transform
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    // After animation finishes, show result and normalize stored rotation
    setTimeout(() => {
      setResult(selectedChoice);
      setIsSpinning(false);
      // normalize rotation to 0..360 for next spin (keeps numbers small)
      setCurrentRotation(normalize(totalRotation));
    }, spinDuration + 20);
  };

  const resetWheel = () => {
    if (wheelRef.current) {
      // smooth reset back to 0 for nicer UX
      wheelRef.current.style.transition = 'transform 450ms ease-out';
      wheelRef.current.style.transform = `rotate(0deg)`;
    }
    setCurrentRotation(0);
    setResult('');
    setError('');
  };

  const segmentAngle = 360 / choices.length;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Decision Spinner
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Can't decide? Let fate choose for you!</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-l-transparent border-r-transparent border-t-gray-800 dark:border-t-gray-200 drop-shadow-md"></div>
            </div>

            <div
              ref={wheelRef}
              className="w-64 h-64 rounded-full border-4 border-gray-300 dark:border-gray-600 relative overflow-hidden"
              style={{ transformOrigin: 'center' }}
            >
              <svg className="w-full h-full" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
                {choices.map((choice, index) => {
                  const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                  const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                  const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                  const x1 = 100 + 90 * Math.cos(startAngle);
                  const y1 = 100 + 90 * Math.sin(startAngle);
                  const x2 = 100 + 90 * Math.cos(endAngle);
                  const y2 = 100 + 90 * Math.sin(endAngle);

                  const pathData = [`M 100 100`, `L ${x1} ${y1}`, `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');

                  const middleAngle = index * segmentAngle + segmentAngle / 2;
                  const positionAngle = middleAngle - 90;
                  const textRadius = 65;
                  const textX = 100 + textRadius * Math.cos((positionAngle * Math.PI) / 180);
                  const textY = 100 + textRadius * Math.sin((positionAngle * Math.PI) / 180);

                  return (
                    <g key={index}>
                      <path d={pathData} fill={colors[index % colors.length]} stroke="#fff" strokeWidth="1" />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${middleAngle > 90 && middleAngle < 270 ? middleAngle + 180 : middleAngle}, ${textX}, ${textY})`}
                      >
                        {choice.length > 12 ? choice.substring(0, 11) + '…' : choice}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {result && (
            <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">The wheel has spoken!</h3>
              <p className="text-xl font-semibold text-green-900 dark:text-green-100">{result}</p>
            </div>
          )}

          {error && (
            <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={spinWheel} disabled={isSpinning || choices.length < 2} className="min-h-[44px] px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200">
              {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </Button>

            {result && (
              <Button onClick={resetWheel} variant="outline" className="min-h-[44px] px-6 py-3">
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Manage Choices</h3>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newChoice}
            onChange={(e) => setNewChoice(e.target.value)}
            placeholder={choices.length >= maxChoices ? `Maximum ${maxChoices} choices reached` : 'Add a new choice...'}
            onKeyDown={(e) => e.key === 'Enter' && addChoice()}
            disabled={choices.length >= maxChoices}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button onClick={addChoice} disabled={!newChoice.trim() || choices.length >= maxChoices} size="sm" title={choices.length >= maxChoices ? `Maximum ${maxChoices} reached` : 'Add choice'}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <input type="text" value={choice} onChange={(e) => updateChoice(index, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Button onClick={() => removeChoice(index)} disabled={choices.length <= 2} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {choices.length}/{maxChoices} choices • Minimum 2 choices required
          {choices.length >= maxChoices && <span className="block text-amber-600 dark:text-amber-400 mt-1">Maximum choices reached. Remove a choice to add a new one.</span>}
        </p>
      </Card>
    </div>
  );
}
