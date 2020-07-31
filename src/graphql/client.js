import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { HOST } from '../config';
import { typeDefs } from './resolvers';
import { GET_INITIAL, GET_CURRENT_SELECTION } from './local-queries';
import { initial, current } from './init';

const cache = new InMemoryCache({
  // caution required here - got some grief when changing this
  // default value works well enough `${o.__typename}:${o.id},`
  //dataIdFromObject: o => `${o.__typename}:${o.id},`
});

const resolvers = {
};

const Client = new ApolloClient({
  link: new HttpLink({ uri: `${HOST}/local_graphql` }),
  cache,
  /*
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2));
    console.log('networkError', JSON.stringify(networkError, null, 2));
  },
  */
  resolvers,
  typeDefs,
});

Client.writeQuery({
  query: GET_INITIAL,
  data: {
    initial,
  },
});

Client.writeQuery({
  query: GET_CURRENT_SELECTION,
  data: {
    current,
  },
});

export default Client;
