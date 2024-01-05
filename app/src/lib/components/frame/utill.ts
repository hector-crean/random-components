import { PointerEvent } from 'react';


function getPointerPositionWithinElement(
    element: HTMLElement,
    event: PointerEvent<HTMLElement>
): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;

    return { x: (left / rect.width) * 100, y: (top / rect.height) * 100 };
}


export { getPointerPositionWithinElement };
