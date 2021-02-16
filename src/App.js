import React from 'react';
import LinkList from './components/LinkList/LinkList';
import CreateLinkForm from './components/LinkForm/LinkForm';


function App() {
  return (
    <React.Fragment>
      <LinkList />
      <CreateLinkForm />
    </React.Fragment>
  );
}

export default App;
