import { useContext } from 'react';
import { Context } from '../store';

const useGlobalState = () => useContext(Context);

export default useGlobalState;
