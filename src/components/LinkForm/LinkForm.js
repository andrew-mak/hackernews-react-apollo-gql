import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from 'react-router';
import { LINKS_PER_PAGE } from '../../constants';
import { FEED_QUERY } from '../LinkList/LinkList';

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
    update: (cache, { data: { post } }) => {
      const take = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = { createdAt: 'desc' };

      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        }
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data.feed.links]
          }
        },
        variables: {
          take,
          skip,
          orderBy
        }
      });
    },
    onCompleted: () => history.push('/new/1')
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