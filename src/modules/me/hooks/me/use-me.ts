import { useContext } from 'react';
import { MeContext } from '../../context/context';

export const useMe = () => {
  return useContext(MeContext);
};
