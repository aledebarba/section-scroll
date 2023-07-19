import React, { useContext } from "react";
import { FullScreenScrollContext } from "./scrollsection";

export const Link = ( { to, duration, ease, ...props} ) => {

    const { children, ...otherProps } = props;
    const context = useContext( FullScreenScrollContext );

    return (
        <div {...otherProps} onClick={ ()=>{
            context.scrollToTarget(to, duration, ease)
        }}>
            { children }
        </div>
    )
}