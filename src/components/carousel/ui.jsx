export const defaultUi = {
    Next: <span>Next ➡️ </span>,
    Prev: <span>⬅️ Prev</span>,
    Nav: {
        Container: ( { children } ) => <div className="absolute flex flex-row justify-center w-screen h-16 p-8 -translate-x-1/2 -translate-y-1/2 align-center left-1/2 top-1/2">{ children }</div>,
        Current: ( { item } ) => <span>{item}</span>,
        Link: ({ item, onClick }) => <button onClick={onClick}>{ item }</button>,
    },
}