import React, { useEffect, useState } from 'react';
import Link from '../Link/Link';
import { useQuery } from '@apollo/client';
import { LINKS_PER_PAGE } from '../../constants';
import { FEED_QUERY } from '../../GQLQueries';
import { getLinksToRender } from '../../util/util';

const LinkList = React.memo(() => {
  console.log('[Render] LinkList');
  const [linksState, setLinksState] = useState({
    prevSkip: 0,
    prevTake: LINKS_PER_PAGE || 5,
    linksCount: 16
  });

  //send Query to GraphQL server
  const { loading, data, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      skip: linksState.prevSkip,
      take: LINKS_PER_PAGE,
    },
    onCompleted: () => {
      // if (data.feed.count !== linksState.linksCount) setLinksState({ ...linksState, linksCount: data.feed.count });
      console.log(data);
    }
  });

  const fetchPageHandler = direction => {
    let skip;
    direction === 'next'
      ? skip = linksState.prevSkip + LINKS_PER_PAGE
      : skip = linksState.prevSkip - LINKS_PER_PAGE;

    // if (direction === 'next' && linksState.linksCount - skip <= 0) return
    // if (direction === 'prev' && linksState.prevSkip <= 0) return

    fetchMore({
      variables: { skip, LINKS_PER_PAGE }
    }).then(fetchedData => {
      setLinksState({
        ...linksState,
        prevSkip: skip,
        prevTake: LINKS_PER_PAGE,
        // count: fetchedData.data.feed.count
      })
    })

  };

  useEffect(() => {
    console.log('MOUNT');
    return () => {
      console.log('UNMOUNT');
    };
  }, []);

  // useEffect(() => {
  //   console.log('linksState: ', linksState);
  //   console.log('data: ', data);
  // });

  let links = null;
  if (data) {
    links = getLinksToRender(true, data).map(
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
            : links && <>
              {links}
              <div className="flex ml4 mv3 gray">
                <div className="pointer mr2" onClick={() => fetchPageHandler('prev')}>Previous</div>
                <div className="pointer" onClick={() => fetchPageHandler('next')}>Next</div>
              </div>
            </>
      }
    </>
  );
});

export default LinkList;