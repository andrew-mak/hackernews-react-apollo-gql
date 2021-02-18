import React, { useEffect, useState } from 'react';
import Link from '../Link/Link';
import { useQuery, gql } from '@apollo/client';

// gql-lib: parse tag strings into document by defined schema
export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
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
    else if (data.feed.links) {
      setPosts(data.feed.links);
      setMessage(null);
    }
  }, [loading, data, error, setMessage, setPosts]);

  let result;
  if (posts.length > 0) {
    result = <>{(posts.map((link, index) => (
      <Link key={link.id} link={link} index={index} />)
    ))}</>
      ;
  }
  else result = message;

  return (
    <div>
      {result}
    </div>
  );
};

export default LinkList;