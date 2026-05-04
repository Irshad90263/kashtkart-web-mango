import React from 'react';

const Loader = ({ size = 'md', color = 'var(--color-secondary)', text }) => {
    const sizes = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-3',
        lg: 'h-16 w-16 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className={`${sizes[size]} animate-spin rounded-full border-t-transparent`}
                style={{ borderColor: `${color} transparent transparent transparent`, borderTopColor: 'transparent', borderRightColor: color, borderBottomColor: color, borderLeftColor: color }}
            ></div>
            {text && (
                <p className="text-sm font-bold text-[var(--color-secondary)] animate-pulse tracking-widest uppercase">
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loader;
