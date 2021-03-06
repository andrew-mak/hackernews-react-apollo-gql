import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import Link from '../components/Link';
import Layout from '../components/Layout';
import { FEED_SEARCH_QUERY } from '../Graphql/gqlQueries';

const Search = () => {

  const [searchFilter, setSearchFilter] = useState('');

  const [executeSearch, { data, loading, error }] = useLazyQuery(FEED_SEARCH_QUERY);

  const searchFilterHandler = event => {
    setSearchFilter(event.target.value)
  };

  const searchButtonHandler = () => {
    if (searchFilter.trim().length < 1) return
    executeSearch({
      variables: { filter: searchFilter },
      fetchPolicy: 'cache-and-network',
      onError: error => console.log(error)
    });
  };

  let links = null;
  if (data) {
    links = data.subfeed
      .map((link, index) => (
        <Link
          key={link.id}
          link={link}
          index={index}
        />)
      )
  };

  let message = null;
  if (loading) message = <p>Searching...</p>
  if (error) message = <p>{error.message + '\n Please, try again.'}</p>

  return (
    <Layout>
      <div>
        Search {"\t"}
        <input type="text" onChange={searchFilterHandler} />
        <button onClick={searchButtonHandler} >OK</button>
      </div>
      {links || message}
    </Layout>
  );
};

export default Search;