import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { CREATE_LINK_MUTATION } from '../Graphql/gqlQueries';
import Layout from '../components/Layout';

const CreateLink = () => {
  const [formState, setFormState] = useState({
    description: '',
    url: '',
    error: ''
  });
  const history = useHistory();

  //send mutations to GraphQL server
  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url
    },
    onError: error => console.log(error.message),
    awaitRefetchQueries: true,
    onCompleted: () => {
      history.go(0);
    }
  });

  const onInputChangeHandler = event => {
    let update = {};
    if (event.target.id === 'url') {
      update = { url: event.target.value };
    }
    if (event.target.id === 'description') {
      update = { description: event.target.value }
    };

    setFormState({
      ...formState,
      ...update,
      error: ''
    });

  };

  const onSubmitHandler = async event => {
    event.preventDefault();

    if (formState.url.trim().length < 1 || formState.description.trim().length < 1) {
      setFormState({ ...formState, error: 'There should be no empty values.' })
      return
    }
    else await createLink();
  }

  return (
    <Layout>
      <form onSubmit={onSubmitHandler}>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            type="text"
            id="description"
            placeholder="A description for the link"
            onChange={onInputChangeHandler}
          />
          <input
            className="mb2"
            value={formState.url}
            type="text"
            id="url"
            placeholder="The URL for the link"
            onChange={onInputChangeHandler}
          />
        </div>
        {formState.error && <div className="dark-red f6" >{formState.error}</div>}
        <button type="submit">Submit</button>
      </form>
    </Layout>
  );
};

export default CreateLink;