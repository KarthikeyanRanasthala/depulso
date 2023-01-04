import { useState } from 'react';

export const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (text, delay: number) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setIsCopied(true)
                setTimeout(() => {
                    setIsCopied(false)
                }, delay);
            }).catch(err => console.log(err))
    };

    return [isCopied, copyToClipboard] as const;
}