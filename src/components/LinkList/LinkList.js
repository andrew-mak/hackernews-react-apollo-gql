import React, { useEffect, useState } from 'react';
import Link from '../Link/Link';
import { useQuery } from '@apollo/client';
import { LINKS_PER_FETCH } from '../../constants';
import { FEED_QUERY } from '../../GQLQueries';

const LinkList = () => {
  console.log('[Render] LinkList');
  const [linksState, setLinksState] = useState({
    prevSkip: 0,
    prevTake: LINKS_PER_FETCH || 5
  });

  //send Query to GraphQL server
  
  const { loading, data, error, previousData, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      skip: linksState.prevSkip,
      take: LINKS_PER_FETCH
    },
    onCompleted: () => {
      console.log(previousData);
    }
  });

  // const cachedLinks  = client.readQuery({
  //   query: FEED_QUERY,
  //   variables: {
  //     skip: linksState.prevSkip,
  //     take: LINKS_PER_PAGE
  //   }
  // });
  // console.log('cachedLinks: ', cachedLinks);

  const fetchPageHandler = () => {
    let skip = linksState.prevSkip + LINKS_PER_FETCH;

    fetchMore({
      variables: { skip, LINKS_PER_FETCH }
    }).then(fetchedData => {
      skip = linksState.prevSkip + fetchedData.data.feed.length;

      setLinksState({
        ...linksState,
        prevSkip: skip,
        prevTake: LINKS_PER_FETCH
      })
    })
  };

  useEffect(() => {
    console.log('MOUNT');
    return () => {
      console.log('UNMOUNT');
    };
  }, []);

  useEffect(() => {
    console.log('linksState: ', linksState);
    // console.log('data: ', data);
  });

  let links = null;
  if (data) {
    console.log(data)
    links = data.feed.links.map(
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
            : links &&
            <>
              {links}
              <div className="flex ml4 mv3 gray">
                <div className="pointer" onClick={fetchPageHandler}>More</div>
                {loading ? <p>Loading...</p> : null}
              </div>
            </>
      }
    </>
  );
};

export default LinkList;