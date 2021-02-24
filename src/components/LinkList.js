import React, { useEffect, useState } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { LINKS_PER_FETCH } from '../util/constants';
import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from '../client/gqlQueries';
import ScrollArrow from './ScrollArrow';

const LinkList = () => {
  const [queryState, setQueryState] = useState({ cursor: null, canFetch: false });

  //send Query to GraphQL server
  let { loading, data, error, fetchMore, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: { take: LINKS_PER_FETCH },
    onCompleted: () => {
      setQueryState({ ...queryState, cursor: data.feed.cursor });
    },
    onError: error => console.log(error.message)
  });

  const fetchMoreHandler = () => {
    setQueryState({ ...queryState, canFetch: true });
  };

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(
        ({ id }) => id === newLink.id
      );
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          __typename: prev.feed.__typename
        }
      });
    }
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });

  useEffect(() => {
    if (fetchMore && queryState.canFetch) {
      fetchMore({
        variables: { cursor: queryState.cursor, take: LINKS_PER_FETCH + 1 }
      })
        .then(response => setQueryState({ canFetch: false, cursor: response.data.feed.cursor }))
        .catch(error => console.log(error));
    }
  }, [queryState.cursor, queryState.canFetch, fetchMore]);

  useEffect(() => {
    console.log('MOUNT');
    return () => {
      fetchMore = subscribeToMore = null;
      console.log('UNMOUNT');
    };
  }, []);

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
              <div className="flex justify-between ml4 mv3 gray">
                <div className="fl dark-gray fw6 pointer" onClick={fetchMoreHandler}>More</div>
                <ScrollArrow styles="mr5 b " />
                {loading ? <p>Loading...</p> : null}
              </div>
            </>
      }
    </>
  );
};

export default LinkList;