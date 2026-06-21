import { useCallback, useContext, useState } from 'react';
import { message } from 'antd';
import { MeContext } from '../../context/context';
import { MeService } from '../../services';
import { LoginFormData } from '../../context/types';

export const useLoginForm = () => {
  const me = useContext(MeContext);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string[]>>>({});

  const onChange = useCallback(<K extends keyof LoginFormData>(key: K, value: LoginFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const onSubmit = useCallback(async () => {
    me.dispatch({ type: 'SET_AUTH_LOADING', payload: true });

    const loginResult = await MeService.login(formData);

    if (loginResult.status === 422) {
      me.dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      setFieldErrors(loginResult.data as Partial<Record<string, string[]>>);
      return;
    }

    if (loginResult.status !== 200) {
      me.dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      message.error(loginResult.data as string);
      return;
    }

    const meResult = await MeService.getMe();
    me.dispatch({ type: 'SET_AUTH_LOADING', payload: false });

    if (meResult.status === 200) {
      me.dispatch({ type: 'SET_USER', payload: meResult.data });
    } else {
      message.error(meResult.data as string);
    }
  }, [formData, me]);

  return {
    formData,
    fieldErrors,
    loading: me.state.auth.loading,
    onChange,
    onSubmit,
  };
};
