import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import CreateLink from './pages/CreateLink';
import { AuthContext } from './context/auth-context';
import Login from './pages/Login';
import New from './pages/New';
import Search from './pages/Search';
import Top from './pages/Top';


function App() {

  const { authToken } = useContext(AuthContext);

  return (
    <Switch>
      <Route exact path="/new" component={New} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/top" component={Top} />
      {authToken ?
        <Route exact path="/create" component={CreateLink} /> :
        <Route exact path="/login" component={Login} />}
      <Redirect to="/new" />
    </Switch>
  );
}

export default App;
