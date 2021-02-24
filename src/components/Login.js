import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { AuthContext } from '../context/auth-context';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../client/gqlQueries';

const Login = () => {

  const { setAuth } = useContext(AuthContext);
  const history = useHistory();
  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: '',
    error: ''
  });

  const [loginMutQuery] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ login }) => {
      setAuth(login.token);
      history.push('/');
    },
    onError: error => {
      console.log(error);
      setFormState({ ...formState, error: error.message });
    }
  });

  const [signupMutQuery] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ signup }) => {
      setAuth(signup.token);
      history.push('/');
    },
    onError: error => {
      console.log(error);
      setFormState({ ...formState, error: error.message });
    }
  });

  const inputChangeHandler = (event, type) => {

    let update = {};

    switch (type) {
      case 'NAME':
        update = { name: event.target.value }
        break;
      case 'EMAIL':
        update = { email: event.target.value }
        break;
      case 'PASSWORD':
        update = { password: event.target.value }
        break;
      case 'LOGIN':
        update = { login: !formState.login }
        break;
      default:
        break;
    }

    setFormState({
      ...formState,
      ...update,
      error: ''
    });
  };

  const beforeAuthorize = () => {

    if ((!formState.login) &&
      (formState.name.trim().length < 1 || formState.email.trim().length < 1 || formState.password.trim().length < 1)) {
      setFormState({ ...formState, error: "There should be no empty values." })
      return
    }
    else {
      (formState.login) ? loginMutQuery() : signupMutQuery()
    }
  }

  return (
    <div>
      <h4 className="mv3">
        {formState.login ? 'Login' : 'Sign Up'}
      </h4>
      <div className="flex flex-column">
        {!formState.login && (
          <input
            value={formState.name}
            type="text"
            placeholder="Your name"
            onChange={e => inputChangeHandler(e, 'NAME')}
          />
        )}
        <input
          value={formState.email}
          onChange={e => inputChangeHandler(e, 'EMAIL')}
          type="email"
          placeholder="Your email address"
        />
        <input
          value={formState.password}
          onChange={e => inputChangeHandler(e, 'PASSWORD')}
          type="password"
          placeholder="Choose a safe password"
        />
        {formState.error && <div className="dark-red f6" >{formState.error}</div>}
      </div>
      <div className="flex mt3">
        <button
          className="pointer mr2 button"
          onClick={beforeAuthorize}>
          {formState.login ? 'login' : 'create account'}
        </button>
        <button
          className="pointer button"
          onClick={e => inputChangeHandler(e, 'LOGIN')}>
          {formState.login
            ? 'need to create an account?'
            : 'already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default Login;