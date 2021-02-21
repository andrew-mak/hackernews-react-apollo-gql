import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { FEED_SEARCH_QUERY } from '../../GQLQueries';
import Link from '../Link/Link';

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [message, setMessage] = useState('');
  const [links, setLinks] = useState();
  const [executeSearch, { data, loading, error }] = useLazyQuery(
    FEED_SEARCH_QUERY
  );
  const searchFilterHandler = event => {
    setSearchFilter(event.target.value)
  };

  const searchButtonHandler = () => {
    executeSearch({ variables: { filter: searchFilter } });
  };

  useEffect(() => {
    if (data) {
      const result = <>{(data.feed.links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />)
      ))}</>
        ;
      setLinks(result);
      setMessage(null);
    }
  }, [data]);

  useEffect(() => {
    if (loading) setMessage('Searching...')
  }, [loading]);

  useEffect(() => {
    if (error) setMessage(error.message + '\n Please, try again.');
  }, [error]);

  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={searchFilterHandler} />
        <button onClick={searchButtonHandler} >OK</button>
      </div>
      {links && message}
    </>
  );
};

export default Search;