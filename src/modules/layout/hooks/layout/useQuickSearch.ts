import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { InputRef, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeclarationsService } from '@modules/declarations/services';

export const useQuickSearch = () => {
    const [isInputShown, setIsInputShown] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isTrendyol, setIsTrendyol] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const enterPressedRef = useRef(false);
    const inputRef = useRef<InputRef>(null);
    const navigate = useNavigate();

    const focusInput = useCallback(() => setTimeout(() => inputRef.current?.focus(), 0), []);

    const checkDeclaration = useCallback(
        async (trackCode: string) => {
            if (!trackCode.trim()) return;

            setIsLoading(true);
            const result = await DeclarationsService.getDeclarationByTrackCode({ trackCode, trendyol: isTrendyol });
            setIsLoading(false);

            if (result.status === 200) {
                navigate(`/declarations/${result.data.id}`);
            } else {
                message.error(result.data);
            }
        },
        [navigate, isTrendyol],
    );

    const onSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            enterPressedRef.current = true;
            checkDeclaration(searchInput);
        },
        [checkDeclaration, searchInput],
    );

    const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
            if (isCmdK) {
                e.preventDefault();
                setIsInputShown(true);
                focusInput();
                return;
            }
            if (isInputShown && e.key === 'Escape') {
                setSearchInput('');
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isInputShown, focusInput]);

    const handleBlur = useCallback(() => {
        if (enterPressedRef.current) {
            enterPressedRef.current = false;
            return;
        }
        setIsInputShown(false);
    }, []);

    const onButtonClick = useCallback(() => {
        setIsInputShown(true);
        focusInput();
    }, [focusInput]);

    const onClear = useCallback(() => {
        setSearchInput('');
        focusInput();
    }, [focusInput]);

    return {
        isInputShown,
        searchInput,
        isTrendyol,
        isLoading,
        inputRef,
        onSubmit,
        onInputChange,
        handleBlur,
        onButtonClick,
        onClear,
        setIsTrendyol,
        checkDeclaration,
    };
};
