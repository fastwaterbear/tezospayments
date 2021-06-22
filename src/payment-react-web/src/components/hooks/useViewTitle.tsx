import { useEffect } from 'react';

export const useViewTitle = (title: string) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};
