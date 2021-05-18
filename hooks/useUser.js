import useGlobalState from './useGlobalState';

const useUser = () => {
  const [{ user }, __] = useGlobalState();
  return user;
};

export default useUser;