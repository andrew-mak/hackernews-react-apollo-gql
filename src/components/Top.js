import React from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_TOP_QUERY } from '../client/gqlQueries';
import { getLinksToRender } from '../util/util';
import ScrollArrow from './ScrollArrow';

const Top = () => {
  //send Query to GraphQL server
  const { data, loading, error } = useQuery(FEED_TOP_QUERY, {
    variables: {
      skip: 0,
      take: 100
    },
    fetchPolicy: 'cache-and-network',
    onError: error => console.log(error)
  });

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
      <div className="mv3 background-gray flex justify-end-ns"><ScrollArrow styles='mr5 ' /></div>
    </>
  );
};

export default Top;