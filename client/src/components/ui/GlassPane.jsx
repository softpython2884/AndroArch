import { twMerge } from 'tailwind-merge';

export const GlassPane = ({ children, className, border = true, blur = 'md', ...props }) => {
    return (
        <div
            className={twMerge(
                "relative overflow-hidden bg-white/5 backdrop-filter",
                blur === 'sm' && "backdrop-blur-sm",
                blur === 'md' && "backdrop-blur-md",
                blur === 'lg' && "backdrop-blur-lg",
                blur === 'xl' && "backdrop-blur-xl",
                blur === '2xl' && "backdrop-blur-2xl",
                border && "border border-white/10 shadow-lg shadow-black/20",
                "transition-all duration-300",
                className
            )}
            {...props}
        >
            {/* Noise Texture Overlay for that premium feel */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>
            {children}
        </div>
    );
};
