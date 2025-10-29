'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProductivityTimerProps {
    className?: string;
}

interface BreakSuggestion {
    suggestion: string;
    duration: number;
    type: 'short' | 'long';
}

type TimerState = 'idle' | 'work' | 'shortBreak' | 'longBreak' | 'paused';

const TIMER_DURATIONS = {
    work: 25 * 60, // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60, // 15 minutes
};

export function ProductivityTimer({ className }: ProductivityTimerProps) {
    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [breakSuggestion, setBreakSuggestion] = useState<BreakSuggestion | null>(null);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio for notifications
    useEffect(() => {
        // Create a simple beep sound using Web Audio API
        const createBeepSound = () => {
            const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        };

        audioRef.current = { play: createBeepSound } as HTMLAudioElement;
    }, []);

    // Timer countdown logic
    useEffect(() => {
        const handleTimerComplete = () => {
            // Play notification sound
            if (audioRef.current) {
                try {
                    audioRef.current.play();
                } catch (error) {
                    console.log('Could not play notification sound:', error);
                }
            }

            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
                const message = timerState === 'work'
                    ? 'Work session complete! Time for a break.'
                    : 'Break time over! Ready to get back to work?';
                new Notification('Pomodoro Timer', { body: message });
            }

            if (timerState === 'work') {
                const newCompletedPomodoros = completedPomodoros + 1;
                setCompletedPomodoros(newCompletedPomodoros);

                // Every 4 pomodoros, take a long break
                const isLongBreak = newCompletedPomodoros % 4 === 0;
                const breakType = isLongBreak ? 'longBreak' : 'shortBreak';

                setTimerState(breakType);
                setTimeLeft(TIMER_DURATIONS[breakType]);
                fetchBreakSuggestion(isLongBreak ? 'long' : 'short');
            } else {
                setTimerState('idle');
                setTimeLeft(TIMER_DURATIONS.work);
                setBreakSuggestion(null);
            }
        };

        if (timerState === 'work' || timerState === 'shortBreak' || timerState === 'longBreak') {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timerState, completedPomodoros]);



    const fetchBreakSuggestion = async (type: 'short' | 'long') => {
        setIsLoadingSuggestion(true);
        try {
            const response = await fetch(`/api/timer?type=${type}`);
            const result = await response.json();

            if (result.success && result.data) {
                setBreakSuggestion(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch break suggestion:', error);
        } finally {
            setIsLoadingSuggestion(false);
        }
    };

    const startTimer = () => {
        // Request notification permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        setTimerState('work');
    };

    const pauseTimer = () => {
        setTimerState('paused');
    };

    const resumeTimer = () => {
        if (timeLeft > 0) {
            const currentState = completedPomodoros % 4 === 0 && timeLeft !== TIMER_DURATIONS.work
                ? 'longBreak'
                : timeLeft === TIMER_DURATIONS.work ? 'work' : 'shortBreak';
            setTimerState(currentState);
        }
    };

    const resetTimer = () => {
        setTimerState('idle');
        setTimeLeft(TIMER_DURATIONS.work);
        setCompletedPomodoros(0);
        setBreakSuggestion(null);
    };

    const skipBreak = () => {
        setTimerState('idle');
        setTimeLeft(TIMER_DURATIONS.work);
        setBreakSuggestion(null);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        switch (timerState) {
            case 'work': return 'text-red-600 dark:text-red-400';
            case 'shortBreak': return 'text-green-600 dark:text-green-400';
            case 'longBreak': return 'text-blue-600 dark:text-blue-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getTimerLabel = () => {
        switch (timerState) {
            case 'work': return 'Work Time';
            case 'shortBreak': return 'Short Break';
            case 'longBreak': return 'Long Break';
            case 'paused': return 'Paused';
            default: return 'Ready to Focus';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Productivity Timer
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Pomodoro technique with weird break suggestions
                </p>
            </div>

            <Card className="p-8 text-center">
                {/* Timer Display */}
                <div className="mb-6">
                    <div className={`text-6xl font-mono font-bold mb-2 ${getTimerColor()}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {getTimerLabel()}
                    </div>
                    {completedPomodoros > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Completed: {completedPomodoros} pomodoro{completedPomodoros !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center mb-6">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full mx-1 ${index < (completedPomodoros % 4)
                                ? 'bg-red-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>

                {/* Break Suggestion */}
                {(timerState === 'shortBreak' || timerState === 'longBreak') && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Break Suggestion
                        </h3>
                        {isLoadingSuggestion ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    Thinking of something weird...
                                </span>
                            </div>
                        ) : breakSuggestion ? (
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                    {breakSuggestion.suggestion}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Suggested duration: {breakSuggestion.duration} minutes
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">
                                Enjoy your break!
                            </p>
                        )}
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex justify-center gap-3 flex-wrap">
                    {timerState === 'idle' && (
                        <Button
                            onClick={startTimer}
                            className="min-h-[44px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg touch-manipulation"
                        >
                            Start Pomodoro
                        </Button>
                    )}

                    {(timerState === 'work' || timerState === 'shortBreak' || timerState === 'longBreak') && (
                        <Button
                            onClick={pauseTimer}
                            className="min-h-[44px] px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg touch-manipulation"
                        >
                            Pause
                        </Button>
                    )}

                    {timerState === 'paused' && (
                        <Button
                            onClick={resumeTimer}
                            className="min-h-[44px] px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg touch-manipulation"
                        >
                            Resume
                        </Button>
                    )}

                    {(timerState === 'shortBreak' || timerState === 'longBreak') && (
                        <Button
                            onClick={skipBreak}
                            className="min-h-[44px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg touch-manipulation"
                        >
                            Skip Break
                        </Button>
                    )}

                    {timerState !== 'idle' && (
                        <Button
                            onClick={resetTimer}
                            variant="outline"
                            className="min-h-[44px] px-6 py-3 rounded-lg touch-manipulation"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </Card>

            {/* Instructions */}
            <Card className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    How it works:
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Work for 25 minutes, then take a 5-minute break</li>
                    <li>• After 4 work sessions, take a longer 15-minute break</li>
                    <li>• Get weird and wonderful break suggestions to keep things fun</li>
                    <li>• Browser notifications will alert you when time&apos;s up</li>
                </ul>
            </Card>
        </div>
    );
}
