import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { AUTH_TOKEN } from '../../constants';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../../GQLQueries';

const Login = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: ''
  });

  const [loginMutQuery] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ login }) => {
      // not good decision store token in a localStorage, just tutorial
      localStorage.setItem(AUTH_TOKEN, login.token);
      history.push('/');
    }
  });

  const [signupMutQuery] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ signup }) => {
      // not good decision store token in a localStorage, just tutorial
      localStorage.setItem(AUTH_TOKEN, signup.token);
      history.push('/');
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
      ...update
    })
  };

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
      </div>
      <div className="flex mt3">
        <button
          className="pointer mr2 button"
          onClick={formState.login ? loginMutQuery : signupMutQuery}>
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