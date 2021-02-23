import React, { useEffect } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { LINKS_PER_FETCH } from '../util/constants';
import { FEED_QUERY } from '../client/gqlQueries';

const LinkList = () => {
  console.log('[LinkList]');

  //send Query to GraphQL server
  const { loading, data, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: { take: LINKS_PER_FETCH },
    onCompleted: () => {
      // console.log('Feed Query completed');
    },
    onError: error => console.log(error)
  });

  const fetchMoreHandler = async () => {

    await fetchMore({
      variables: { cursor: data.feed.cursor, take: LINKS_PER_FETCH + 1 }
    }).then(() =>
      console.log('FetchMore completed')
    ).catch(error => console.log(error));
  };

  useEffect(() => {
    console.log('MOUNT');
    return () => {
      console.log('UNMOUNT');
    };
  }, []);

  useEffect(() => {
    console.log('Rerendering');
  });

  let links = null;
  if (data) {
    links = data.feed.links
      .map((link, index) => (
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
            : links &&
            <>
              {links}
              <div className="flex ml4 mv3 gray">
                <div className="dark-gray fw6 pointer" onClick={fetchMoreHandler}>More</div>
                {loading ? <p>Loading...</p> : null}
              </div>
            </>
      }
    </>
  );
};

export default LinkList;