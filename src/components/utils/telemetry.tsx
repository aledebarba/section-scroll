import React, { useState, useEffect } from "react";
import { Console, Hook, Unhook } from "console-feed";

const Telemetry = () => {
    const [logs, setLogs] = useState([]);

    // run once!
    useEffect(() => {
        const hookedConsole = Hook(
            window.console,
            (log) => setLogs((currLogs) => [...currLogs, log]),
            false
        );
        return () => { Unhook(hookedConsole) };
    }, []);

    return <div className="grid place-content-center fixed w-1/5 p-4 border-4 border-solid pointer-events-auto border-teal-500/20 right-16 top-10 h-[80vh] bg-zinc-950 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 p-2 overflow-scroll bg-zinc-800 custom-scroll-bar">
                <Console logs={logs} variant="dark"/>
            </div>
        </div>
};

export { Telemetry };

export function logger ( ...args:any ) {
    const style = "background: #fff; color: black; font-size: 1rem; font-weight: bold; padding: 4px 6px 4px 4px"
    args.forEach( (arg:any) => console.log( `%c${arg}`, style ) );
}
