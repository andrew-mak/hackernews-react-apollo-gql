import React, { useState } from 'react';
import { AUTH_TOKEN } from '../util/constants';

export const AuthContext = React.createContext({
  authToken: null,
  setAuth: () => { }
});

const AuthContextConf = (props) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem(AUTH_TOKEN));

  const setAuth = authToken => {
    if (authToken) {
      setAuthToken(authToken);
      // not good decision store token in a localStorage, just tutorial
      localStorage.setItem(AUTH_TOKEN, authToken);
    }
    else {
      setAuthToken(null);
      // localStorage.setItem(AUTH_TOKEN, null);
      localStorage.removeItem(AUTH_TOKEN);
    }
    return authToken
  };

  return (
    <AuthContext.Provider value={{
      authToken: authToken,
      setAuth: setAuth
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextConf;