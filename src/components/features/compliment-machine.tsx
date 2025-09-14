/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Send, RefreshCw } from 'lucide-react';

interface ComplimentMachineProps {
    className?: string;
}

interface ReceivedCompliment {
    message: string;
    sender: string;
    timestamp: number;
    source: 'database' | 'fallback';
}

export function ComplimentMachine({ className }: ComplimentMachineProps) {
    const [mode, setMode] = useState<'receive' | 'send'>('receive');

    // Receive mode state
    const [compliment, setCompliment] = useState<ReceivedCompliment | null>(null);
    const [isLoadingCompliment, setIsLoadingCompliment] = useState(false);
    const [receiveError, setReceiveError] = useState<string>('');

    // Send mode state
    const [message, setMessage] = useState('');
    const [sender, setSender] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string>('');
    const [sendSuccess, setSendSuccess] = useState<string>('');

    const receiveCompliment = async () => {
        setIsLoadingCompliment(true);
        setReceiveError('');

        try {
            const response = await fetch('/api/compliment');
            const result = await response.json();

            if (result.success && result.data) {
                setCompliment(result.data);
            } else {
                setReceiveError(result.error?.message || 'Failed to get compliment');
            }
        } catch (err) {
            setReceiveError('Network error occurred while fetching compliment');
        } finally {
            setIsLoadingCompliment(false);
        }
    };

    const sendCompliment = async () => {
        if (!message.trim() || !sender.trim()) {
            setSendError('Please fill in both message and sender fields');
            return;
        }

        setIsSending(true);
        setSendError('');
        setSendSuccess('');

        try {
            const response = await fetch('/api/compliment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    sender: sender.trim()
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSendSuccess(result.data.message);
                setMessage('');
                setSender('');
            } else {
                setSendError(result.error?.message || 'Failed to send compliment');
            }
        } catch (err) {
            setSendError('Network error occurred while sending compliment');
        } finally {
            setIsSending(false);
        }
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Compliment Machine
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Spread joy and receive kindness from others
                </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
                    <button
                        onClick={() => setMode('receive')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'receive'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                    >
                        <Heart className="w-4 h-4 inline mr-2" />
                        Receive
                    </button>
                    <button
                        onClick={() => setMode('send')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'send'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                    >
                        <Send className="w-4 h-4 inline mr-2" />
                        Send
                    </button>
                </div>
            </div>

            {mode === 'receive' ? (
                <Card className="p-6">
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                            <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                        </div>

                        {isLoadingCompliment ? (
                            <div>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Finding a lovely compliment for you...
                                </p>
                            </div>
                        ) : receiveError ? (
                            <div className="text-red-600 dark:text-red-400">
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
                                <p className="font-medium mb-2">Oops!</p>
                                <p className="text-sm">{receiveError}</p>
                            </div>
                        ) : compliment ? (
                            <div className="space-y-4">
                                <blockquote className="text-xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                                    "{compliment.message}"
                                </blockquote>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p className="font-medium">— {compliment.sender}</p>
                                    <p className="mt-1">{formatTimestamp(compliment.timestamp)}</p>
                                    {compliment.source && (
                                        <p className="text-xs mt-2">
                                            Source: {compliment.source === 'database' ? 'Community' : 'Curated Collection'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400">
                                <p className="text-lg mb-2">Ready to brighten your day?</p>
                                <p className="text-sm">Click the button below to receive a wonderful compliment!</p>
                            </div>
                        )}

                        <Button
                            onClick={receiveCompliment}
                            disabled={isLoadingCompliment}
                            className="min-h-[44px] px-8 py-3 text-lg font-medium bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white rounded-lg transition-colors duration-200"
                        >
                            <RefreshCw className={`w-5 h-5 mr-2 ${isLoadingCompliment ? 'animate-spin' : ''}`} />
                            {isLoadingCompliment ? 'Getting Compliment...' : 'Get Compliment'}
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card className="p-6">
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                                <Send className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Send a Compliment
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Make someone's day brighter with your kind words
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="compliment-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Compliment
                                </label>
                                <textarea
                                    id="compliment-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write something nice and uplifting..."
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {message.length}/500 characters
                                </p>
                            </div>

                            <div>
                                <label htmlFor="sender-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Name (or stay anonymous)
                                </label>
                                <input
                                    id="sender-name"
                                    type="text"
                                    value={sender}
                                    onChange={(e) => setSender(e.target.value)}
                                    placeholder="Anonymous Friend"
                                    maxLength={50}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {sender.length}/50 characters
                                </p>
                            </div>
                        </div>

                        {sendError && (
                            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                <p className="text-red-800 dark:text-red-200 text-sm">{sendError}</p>
                            </div>
                        )}

                        {sendSuccess && (
                            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <p className="text-green-800 dark:text-green-200 text-sm">{sendSuccess}</p>
                            </div>
                        )}

                        <Button
                            onClick={sendCompliment}
                            disabled={isSending || !message.trim() || !sender.trim()}
                            className="w-full min-h-[44px] px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
                        >
                            <Send className={`w-5 h-5 mr-2 ${isSending ? 'animate-pulse' : ''}`} />
                            {isSending ? 'Sending...' : 'Send Compliment'}
                        </Button>

                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            <p>All compliments are reviewed for appropriateness before being shared.</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}