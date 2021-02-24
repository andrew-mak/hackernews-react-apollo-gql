import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { timeDifferenceForDate } from '../util/util';
import { LINKS_PER_FETCH } from '../util/constants';
import { AuthContext } from '../context/auth-context';
import { VOTE_MUTATION, FEED_QUERY } from '../client/gqlQueries';

const Link = React.memo((props) => {
  const { authToken } = useContext(AuthContext);
  const { link } = props;

  const take = LINKS_PER_FETCH;
  const skip = 0;
  const orderBy = { createdAt: 'desc' };

  const [voteHandler] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    update(cache, { data: { vote } }) {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        },
        onError: error => console.error(error)
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        },
        variables: {
          take,
          skip,
          orderBy
        },
        onError: error => console.error(error)
      });
    },
    onError: error => console.error(error)
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="f6 mid-gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: 'pointer' }}
            onClick={voteHandler}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div className="f6-ns black">
          {link.description + "\t"}
          <a href={link.url} className="f7-ns dark-blue no-underline underline-hover">({new URL(link.url).host})</a>
        </div>
        <div className="f7 lh-copy gray">
          {link.votes.length} votes | by{' '}
          {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
});

export default Link;