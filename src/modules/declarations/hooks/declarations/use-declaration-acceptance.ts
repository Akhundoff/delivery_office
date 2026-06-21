import { useCallback, useRef, useState } from 'react';
import { message } from 'antd';
import { InputRef } from 'antd';
import { DeclarationsService } from '../../services';
import { IDeclaration } from '../../interfaces';

export const useDeclarationAcceptance = () => {
  const trackCodeInputRef = useRef<InputRef | null>(null);
  const [tempTrackCode, setTempTrackCode] = useState('');
  const [trackCode, setTrackCode] = useState('');
  const [autoAccept, setAutoAccept] = useState(false);
  const [data, setData] = useState<IDeclaration | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = useCallback(() => {
    setTrackCode('');
    setTempTrackCode('');
    setData(null);
    trackCodeInputRef.current?.focus();
  }, []);

  const handleSearch = useCallback(
    async (value: string) => {
      if (!value.trim()) return;

      setIsLoading(true);

      const declarationResult = await DeclarationsService.getDeclarationByTrackCode({ trackCode: value.trim() });

      if (declarationResult.status !== 200) {
        message.error(declarationResult.data as string);
        setIsLoading(false);
        return;
      }

      if (!autoAccept) {
        setTrackCode(value);
        setData(declarationResult.data);
        setIsLoading(false);
        return;
      }

      const acceptResult = await DeclarationsService.acceptDeclaration(declarationResult.data.id, {
        wardrobeNumber: declarationResult.data.wardrobeNumber || '',
        description: declarationResult.data.description || '',
        updateStatus: true,
      });

      setIsLoading(false);

      if (acceptResult.status !== 200) {
        message.error(acceptResult.data as string);
        return;
      }

      message.success('Bağlama qəbul olundu.');
      handleReset();
    },
    [autoAccept, handleReset],
  );

  const handleAccept = useCallback(
    async (values: { wardrobeNumber: string; description: string; updateStatus: boolean }) => {
      if (!data) return;
      const result = await DeclarationsService.acceptDeclaration(data.id, values);
      if (result.status === 200) {
        message.success('Bağlama qəbul edildi.');
        handleReset();
      } else {
        message.error(result.data as string);
      }
    },
    [data, handleReset],
  );

  return {
    trackCode,
    tempTrackCode,
    setTempTrackCode,
    trackCodeInputRef,
    autoAccept,
    setAutoAccept,
    data,
    isLoading,
    handleSearch,
    handleAccept,
    handleReset,
  };
};
