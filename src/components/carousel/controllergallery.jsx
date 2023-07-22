export const showDots = (
        active="rounded-full text-black transition-all duration-500 bg-amber-500 [border:1px_solid_white] shadow-md",
        inactive="rounded-full text-white transition-all duration-500 bg-slate-800 border border-white border-solid hover:bg-white hover:cursor-pointer hover:text-black"
    ) => ({
        className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-row flex-no-wrap gap-x-2",
        options: false,
        Render: ({ item }) => <div>
        {item.isActive
            && <div className={ `w-[16px] h-[16px] ${active}` }></div>
            || <div className={ `w-[16px] h-[16px] ${inactive}` }></div>
        }
        </div>
    });

export const showDashes = (
        active="rounded-sm text-black transition-all duration-500 bg-amber-500 [border:1px_solid_white] shadow-md",
        inactive="rounded-sm text-white transition-all duration-500 bg-slate-800 border border-white border-solid hover:bg-white hover:cursor-pointer hover:text-black"
    ) => ({
        className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-row flex-no-wrap gap-x-2",
        options: false,
        Render: ({ item }) => <div>
        {item.isActive
            && <div className={ `w-[56px] h-[2rem] grid place-content-center ${active}` }>{ item.index+1 }</div>
            || <div className={ `w-[32px] h-[2rem] grid place-content-center ${inactive}` }> {item.index+1 }</div>
        }
        </div>
    });

