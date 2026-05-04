import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error(error);

    return (
        <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center p-6 font-[var(--font-body)]">
            <div className="max-w-md w-full bg-[var(--color-muted)] rounded-[40px] p-10 text-center border border-[var(--color-secondary)]/10 shadow-2xl">
                <div className="w-20 h-20 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={40} className="text-[var(--color-secondary)]" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-4 font-[var(--font-heading)]">
                    Oops! Something went wrong
                </h1>

                <p className="text-gray-400 mb-10 leading-relaxed">
                    We're sorry for the inconvenience. Our team has been notified. Please try refreshing the page or head back home.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                    >
                        <RefreshCw size={18} />
                        Refresh Page
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all"
                    >
                        <Home size={18} />
                        Back to Home
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 pt-8 border-t border-white/5 text-left">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Error Detail:</p>
                        <div className="bg-black/20 p-4 rounded-xl overflow-auto max-h-40">
                            <pre className="text-[10px] text-red-400/80 font-mono">
                                {error?.message || 'Unknown Error'}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;
