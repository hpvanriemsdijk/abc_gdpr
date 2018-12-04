import React from 'react'
import ReactDOM from 'react-dom'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import { ApolloLink} from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'

import registerServiceWorker from './registerServiceWorker';
import { logout } from './services/Actions'
import App from './components/App'

console.log(process.env);

const httpLink = createHttpLink({ 
  uri: process.env.REACT_APP_GRAPH_SIMPLE 
})

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('graphcoolToken')
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    if(networkError.statusCode === 401){
      logout()
    }
  }

  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
});

const httpLinkWithAuthToken = ApolloLink.from([
  middlewareLink,
  errorLink,
  httpLink,
]);

export const client = new ApolloClient({ 
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
})

ReactDOM.render((
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  ),
  document.getElementById('root')
)

registerServiceWorker();