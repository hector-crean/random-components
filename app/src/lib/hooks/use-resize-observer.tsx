import { useEffect, useState } from 'react';

type Size = { width: number; height: number };

function useResizeObserver<T extends HTMLElement>(ref: React.RefObject<T>): Size | undefined {
    const [size, setSize] = useState<Size | undefined>();

    useEffect(() => {
        const observeTarget = ref.current;
        if (!observeTarget) return;

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            });
        });

        resizeObserver.observe(observeTarget);

        return () => {
            if (observeTarget) {
                resizeObserver.unobserve(observeTarget);
            }
        };
    }, [ref]);

    return size;
}

export { useResizeObserver };

