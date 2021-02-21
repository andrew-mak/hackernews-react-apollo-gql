import React from 'react';
import CreateLinkForm from './components/LinkForm/LinkForm';
import LinkList from './components/LinkList/LinkList';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Top from './components/Top/Top';
import Search from './components/Search/Search';
import { Switch, Route, Redirect } from 'react-router-dom';


function App() {
  console.log('[Render App]');
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/new" component={LinkList} />
          <Route exact path="/create" component={CreateLinkForm} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/top" component={Top} />
          <Redirect to="/new" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
