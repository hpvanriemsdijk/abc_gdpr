import React from 'react'
import ReactDOM from 'react-dom'

import ApolloClient from 'apollo-client'
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { notification } from 'antd';
import registerServiceWorker from './registerServiceWorker';
import { logout } from './services/Actions'
import App from './components/App'

const httpLink = createHttpLink({ 
  uri: process.env.REACT_APP_GRAPH_SIMPLE 
})

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('id_token')

  if(token){
    const authorizationHeader = token ? `Bearer ${token}` : null

    operation.setContext({
      headers: {
        authorization: authorizationHeader
      }
    })
  }

  return forward(operation)
})

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {   
    console.log(`[Network error]: ${networkError}`);
    notification['error']({
      message: 'Network error',
      description: `An network error has occured, check te console for more info.` ,
      duration: 0
    });
    if(networkError.statusCode === 401) logout()
  }

  if (graphQLErrors){
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          notification['warning']({
            message: 'Authentication error',
            description: err.message,
            duration: 6
          });
          break
        case 'ANOTHER_ERROR_CODE':
          // ...
          break
        default:
          notification['error']({
            message: 'GraphQL error',
            description: `An graphQL error has occured, check te console for more info.` ,
            duration: 6
          });
          console.log(graphQLErrors)
      }
  }
}});

const httpLinkWithAuthToken = ApolloLink.from([
  middlewareLink,
  errorLink,
  httpLink,
]);

const cache = new InMemoryCache().restore(window.__APOLLO_STATE__)

export const client = new ApolloClient({ 
  link: httpLinkWithAuthToken,
  cache: cache
})

ReactDOM.render((
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  ),
  document.getElementById('root')
)

registerServiceWorker();