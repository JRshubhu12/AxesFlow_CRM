"use client";

import { Sparkles } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading, please wait...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50/80 to-purple-100/80 dark:from-gray-900/90 dark:to-gray-950/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-400/30 blur-2xl animate-pulse" style={{ width: 80, height: 80 }} />
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg">
            <Sparkles className="h-10 w-10 text-white animate-bounce" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{message}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">We&apos;re preparing your experience...</p>
        </div>
        <div className="w-40 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-loading-bar" />
        </div>
      </div>
      <style jsx global>{`
        @keyframes animate-loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: animate-loading-bar 1.8s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
