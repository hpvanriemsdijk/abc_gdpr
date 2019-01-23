import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink} from 'apollo-link'
import { onError } from 'apollo-link-error'
import { notification } from 'antd';
import registerServiceWorker from './registerServiceWorker';
import { logout } from './services/Actions'
import App from './components/App'

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
    notification['error']({
      message: 'Network error',
      description: `An network error has occured, check te console for more info.` ,
      duration: 0
    });
    if(networkError.statusCode === 401) logout()
  }

  if (graphQLErrors){
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );

    notification['error']({
      message: 'GraphQL error',
      description: `An graphQL error has occured, check te console for more info.` ,
      duration: 6
    });
  }
});

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
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  ),
  document.getElementById('root')
)

registerServiceWorker();