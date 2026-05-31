import { useContext } from 'react';
import { CounterContext } from '../../context';

export const useCounter = () => useContext(CounterContext);
