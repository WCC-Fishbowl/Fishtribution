/* eslint-disable @next/next/no-img-element */
import { CatchWithRelations } from '@/types/CatchWithRelations';

interface CatchRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    catchRecord: CatchWithRelations;
    showUser: boolean;
    imageSide?: 'left' | 'right';
    isLoading?: boolean;
}

export default function CatchRow({
    catchRecord,
    showUser = false,
    imageSide = 'left',
    isLoading = false,
    className = '',
    children,
    ...props
}: CatchRowProps) {
    const baseClasses = 'flex w-full gap-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary';

    const combinedClasses = `
        ${baseClasses}
        ${imageSide === 'right' ? 'flex-row-reverse' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button type="button" className={combinedClasses} {...props}>
            <div className="flex w-32 shrink-0 flex-col gap-1">
                <img
                    /*src={catchRecord.images.length === 0 ? '/betta.jpg' : catchRecord.images[0]}*/
                    src="/betta.jpg"
                    alt={catchRecord.fishTaxon.scientific_name}
                    className={`h-24 w-32 shrink-0 rounded-md object-cover ${imageSide === 'left'
                        ? 'shadow-[inset_5px_4px_4px_0px_rgba(0,0,0,0.25)]'
                        : 'shadow-[inset_-5px_4px_4px_0px_rgba(0,0,0,0.25)]'
                    }`}
                />
            </div>
            <div className="w-full flex flex-1 flex-col self-stretch">
                <h3 className="font-title text-xl font-bold leading-none text-slate-700">
                    {isLoading ? "Loading..." : catchRecord.fishTaxon.common_name}
                </h3>
                <p className="text-[10px] font-bold leading-5 text-slate-700">
                    {isLoading ? "Loading..." : catchRecord.fishTaxon.scientific_name}
                </p>
                <p className="mt-auto text-[8px] leading-5 text-slate-400 truncate">
                    {isLoading
                        ? "Loading..."
                        : `${catchRecord.catchRecord.caught_at.getMonth() + "/" + catchRecord.catchRecord.caught_at.getDay() + "/" + catchRecord.catchRecord.caught_at.getFullYear()}${showUser
                            ? " ・ " + (catchRecord.user.display_name
                                ? catchRecord.user.display_name
                                : catchRecord.user.username)
                            : ""
                        }`
                    }
                </p>
            </div>
            {children}
        </button>
    );
}

interface CatchTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    catchRecord: CatchWithRelations;
    showUser: boolean;
    imagePosition?: 'top' | 'bottom';
    isLoading?: boolean;
}

export function CatchTile({
    catchRecord,
    showUser = false,
    imagePosition = 'top',
    isLoading = false,
    className = '',
    children,
    ...props
}: CatchTileProps) {
    const baseClasses = 'flex w-full overflow-hidden rounded-md text-left shadow-[6px_7px_4px_0px_rgba(0,0,0,0.25)] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary';

    const combinedClasses = `
        ${baseClasses}
        ${imagePosition === 'top' ? 'flex-col' : 'flex-col-reverse'}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button type="button" className={combinedClasses} {...props}>
            <img
                /*src={catchRecord.images.length === 0 ? '/betta.jpg' : catchRecord.images[0]}*/
                src="/betta.jpg"
                alt={catchRecord.fishTaxon.scientific_name}
                className="h-22 w-full shrink-0 object-cover"
            />
            <div className="flex h-24 w-full flex-col bg-white p-2">
                <h3 className="font-title text-lg font-bold leading-none text-slate-700">
                    {isLoading ? "Loading..." : catchRecord.fishTaxon.common_name}
                </h3>
                <p className="mt-1 line-clamp-2 text-[8px] leading-3 font-bold text-slate-700">
                    {isLoading ? "Loading..." : catchRecord.fishTaxon.scientific_name}
                </p>
                <p className="mt-auto text-[6px] leading-3 text-slate-400 truncate">
                    {isLoading
                        ? "Loading..."
                        : `${catchRecord.catchRecord.caught_at.getMonth() + "/" + catchRecord.catchRecord.caught_at.getDay() + "/" + catchRecord.catchRecord.caught_at.getFullYear()}${showUser
                            ? " ・ " + (catchRecord.user.display_name
                                ? catchRecord.user.display_name
                                : catchRecord.user.username)
                            : ""
                        }`
                    }
                </p>
            </div>
            {children}
        </button>
    );
}