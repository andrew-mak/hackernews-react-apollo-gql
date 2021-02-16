import React, { useEffect, useState } from 'react';
import Link from '../Link/Link';
import { useQuery, gql } from '@apollo/client';

// gql-lib: parse tag strings into document by defined schema
const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

const LinkList = () => {
  //send Query to GraphQL server
  const { data, error, loading } = useQuery(FEED_QUERY);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (loading) setMessage('Loading...')
    else if (error) setMessage(error.message + '\n Please, try again.');
    else if (data.feed.links) setPosts(data.feed.links)
  }, [loading, data, error, setMessage, setPosts]);

  let result;
  if (posts.length > 0) {
    result = posts.map(link => (
      <Link key={link.id} link={link} />
    ));
  }
  else result = message;

  return (
    <div>
      {result}
    </div>
  );
};

export default LinkList;