import { setContext } from '@apollo/client/link/context';
import { split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createHttpLink, InMemoryCache, ApolloClient } from '@apollo/client';
import { AUTH_TOKEN } from './constants';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const cache = new InMemoryCache({
  addTypename: true,
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: ['id'],
          merge(existing, incoming, { args }) {
            if (!incoming || incoming.length === 0) {
              console.log('[Merge] return existing');
              return existing;
            }
            if (!existing) {
              console.log('[Merge] return incoming');
              return incoming;
            }

            // console.log('[Merge] existing: ', existing);
            // console.log('[Merge] incoming: ', incoming);

            const result = {
              ...existing,
              id: incoming.id,
              links: [...existing, ...incoming],
          };
            console.log(result)
            return result;
          }
        }
      }
    },
    Link: {
      keyFields: ['id']
    },
    User: {
      keyFields: ['id']
    }
  }
});

const client = new ApolloClient({
  link,
  cache,
  connectToDevTools: process.env.NODE_ENV === 'development'
});

export default client;