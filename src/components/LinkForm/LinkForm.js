import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from 'react-router';

// gql-lib: parse tag strings into document by defined schema
const CREATE_LINK_MUTATION = gql`
  mutation PostMutation(
    $description: String!
    $url: String!
  ) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const LinkForm = () => {
  const [formState, setFormState] = useState({
    description: '',
    url: ''
  });
  //send mutations to GraphQL server
  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url
    },
    onCompleted: () => history.push('/')
  });
  const history = useHistory();

  const onInputChangeHandler = event => {
    if (event.target.id === 'url') {
      setFormState({
        ...formState,
        url: event.target.value
      });
    }
    if (event.target.id === 'description') {
      setFormState({
        ...formState,
        description: event.target.value,
      });
    }
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    createLink();
    setFormState({
      description: '',
      url: ''
    })
  }

  return (
    <div>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LinkForm;