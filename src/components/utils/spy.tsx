import { Memo, useObservable } from "@legendapp/state/react"
import { observe  } from "@legendapp/state";
import React from "react";


export function SpyWindow( props: any ) {

    return (
        <div className="fixed top-8 right-8 z-50 p-4 bg-white/50 rounded-lg flex flex-col w-[320px] overflow-hidden hover:bg-white/100">
                <Memo>{() => <div className="grid grid-cols-2">
                        <p className="w-1/2 text-sm text-black">Prev</p>
                        <p className="w-1/2 text-sm text-black">{props.state.prev.get()}</p>
                        <p className="w-1/2 text-sm text-black">Index</p>
                        <p className="w-1/2 text-sm text-black">{props.state.index.get()}</p>
                        <p className="w-1/2 text-sm text-black">Next</p>
                        <p className="w-1/2 text-sm text-black">{props.state.next.get()}</p>
                        <p className="w-1/2 text-sm text-black">min</p>
                        <p className="w-1/2 text-sm text-black">{props.state.min.get()}</p>
                        <p className="w-1/2 text-sm text-black">max</p>
                        <p className="w-1/2 text-sm text-black">{props.state.max.get()}</p>
                    </div>}
                </Memo>
        </div>
        ) }
