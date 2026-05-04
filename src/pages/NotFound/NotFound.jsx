const NotFound = () => {
    return (
        <div className="py-24 px-8 text-center bg-[var(--color-primary)] min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-8xl text-[var(--color-secondary)] font-bold mb-4 font-[var(--font-heading)]">404</h1>
            <h2 className="text-2xl md:text-3xl text-white font-bold mb-6">Page Not Found</h2>
            <p className="text-gray-400 mb-8 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <a
                href="/"
                className="inline-block px-8 py-3 bg-[var(--color-secondary)] text-[var(--color-primary)] font-bold rounded-xl hover:bg-[#ffe033] transition-all shadow-lg"
            >
                Back to Home
            </a>
        </div>
    );
};

export default NotFound;
