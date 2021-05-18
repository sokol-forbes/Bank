const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.body,
        messageColor: action.color,
      };
    case 'CLEAR_MESSAGE':
      return {
        ...state,
        message: null,
        messageColor: null,
      };
    case 'LOGIN':
      return {
        ...state,
        user: {
          isAuthenticated: true,
          ...action.user,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        user: {
          isAuthenticated: false,
        },
      };
    default:
      return state;
  }
};

export default Reducer;