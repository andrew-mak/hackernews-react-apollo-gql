import React from 'react';
import { useQuery } from '@apollo/client';
import Layout from '../components/Layout';
import Link from '../components/Link';
import { FEED_TOP_QUERY } from '../Graphql/gqlQueries';
import { getLinksToRender } from '../util/dateUtil';

const Top = () => {
  //send Query to GraphQL server
  const { data, loading, error } = useQuery(FEED_TOP_QUERY, {
    variables: {
      skip: 0,
      take: 100
    },
    pollInterval: 12000,
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
    <Layout>
      {
        error
          ? <pre>{JSON.stringify(error, null, 2)}</pre>
          : loading
            ? <p> Loading...</p>
            : links && links
      }
    </Layout>
  );
};

export default Top;