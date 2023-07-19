import React from "react";

export const Link = ( props ) => {
    const { children, ...otherProps } = props;
    return (
        <a {...otherProps}>
            { children }
        </a>
    )
}