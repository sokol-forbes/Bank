import { useCallback } from 'react';
import useGlobalState from './useGlobalState';
import { useEffect } from 'react';
import { Notify } from 'notiflix';

const useMessage = (body) => {
  const [state, dispatch] = useGlobalState();

  const setError = useCallback(body => Notify.Failure(body), [dispatch]);
  const setAlert = useCallback(body => Notify.Info(body), [dispatch]);
  const setSuccess = useCallback(body => Notify.Success(body), [dispatch]);
  const setWarning = useCallback(body => Notify.Warning(body), [dispatch]);
  const clearMessage = useCallback(() => dispatch({ type: 'CLEAR_MESSAGE' }), [dispatch]);

  useEffect(() => {
    Notify.Init({
      width: '400px',
      clickToClose: true,
      distance: '100px 10px',
      fontFamily: 'Nunito',
      position: 'left-top',
    });
  }, []);

  return { setError, setAlert, setSuccess, clearMessage, message: state.message, messageColor: state.messageColor };
};

export default useMessage;