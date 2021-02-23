import React, { useEffect } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_TOP_QUERY } from '../client/gqlQueries';
import { getLinksToRender } from '../util/util';

const Top = () => {
  console.log('[Render] Top');

  //send Query to GraphQL server
  const { data, loading, error } = useQuery(FEED_TOP_QUERY, {
    variables: {
      skip: 0,
      take: 100
    },
    onError: error => console.log(error),
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    console.log('MOUNT');
    return () => {
      console.log('UNMOUNT');
    };
  }, []);

  let links = null;
  if (data) {
    links = getLinksToRender(data).map(
      (link, index) => (
        <Link
          key={link.id}
          link={link}
          index={index}
        />)
    );
  }

  return (
    <>
      {
        error ? <pre>{JSON.stringify(error, null, 2)}</pre>
          : loading ? <p> Loading...</p>
            : links && links
      }
    </>
  );
};

export default Top;