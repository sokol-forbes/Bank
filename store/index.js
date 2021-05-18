import { createContext, useReducer } from "react";
import Reducer from './reducer'

const initialState = {
  message: null,
  messageColor: null,
  user: {
    isAuthenticated: false,
  },
};

const Provider = ({ children, user }) => {
  const [state, dispatch] = useReducer(Reducer, { ...initialState, user });
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Provider;