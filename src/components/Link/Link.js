import React from 'react';
import { useMutation } from '@apollo/client';
import { timeDifferenceForDate } from '../../util/util';
import { AUTH_TOKEN, LINKS_PER_FETCH } from '../../constants';
import { VOTE_MUTATION, FEED_QUERY } from '../../GQLQueries';

const Link = (props) => {
  // console.log('[Render] Link');
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

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
        }
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
        }
      });
    }
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
          {link.description +"\t"}
          <a href={link.url} className="f7-ns dark-blue no-underline underline-hover">({new URL(link.url).host})</a>
        </div>
        {authToken && (
          <div className="f7 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Link;