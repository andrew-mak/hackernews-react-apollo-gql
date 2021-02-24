import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CreateLinkForm from './components/LinkForm';
import LinkList from './components/LinkList';
import Header from './components/Header';
import Login from './components/Login';
import Top from './components/Top';
import Search from './components/Search';
import { AuthContext } from './context/auth-context';


function App() {

  const { authToken } = useContext(AuthContext);
  
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/new" component={LinkList} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/top" component={Top} />
          {authToken ? <Route exact path="/create" component={CreateLinkForm} /> : null}
          <Redirect to="/new" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
