import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Layout, Row, Breadcrumb, Spin } from 'antd';
import 'antd/dist/antd.css';
import '../index.css';

import error_404 from './generic/error_404'
import landingPage from './generic/landingPage'
import HeaderMenu from './menu/HeaderMenu'
import LeftMenu from './menu/LeftMenu'
import LoginUser from './users/LoginUser'
import listUsers from './users/ListUsers'

const { Footer, Sider } = Layout;

class App extends React.Component {
  isLoggedin(){
    if(this.props.loggedInUserQuery.loggedInUser && this.props.loggedInUserQuery.loggedInUser.id !== null){
      return true;
    }else{
      return false;
    }
  }

  AuthenticatedLayout(props){
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <HeaderMenu />
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <LeftMenu />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            {props.children}
            <Footer style={{ textAlign: 'center' }}>
              The Footer
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }

  AnonymousLayout(props){
    return (
      <Layout style={{height:"100vh", padding: 24}}>
      <Row type="flex" justify="center">
        {props.children}
      </Row>
      </Layout>
    )
  }

  appRouter(){
    const PublicRoute = ({ component: Component, layout: Layout, ...rest }) => (
      <Route {...rest} render={props => (
        this.isLoggedin() === false
          ? <Layout><Component {...props} /></Layout>
          : <Redirect to={{
              pathname: '/',
              state: { from: props.location }
            }} />
      )} />
    )

    const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
      <Route {...rest} render={props => (
        this.isLoggedin() === true
          ? <Layout><Component {...props} /></Layout>
          : <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }} />
      )} />
    )

    return (
      <Router>
        <div>
          <Switch>
            <PublicRoute path='/login' layout={ this.AnonymousLayout } component={LoginUser} />
            <AppRoute path='/users/:userId' layout={ this.AuthenticatedLayout } component={listUsers} />
            <AppRoute path='/users' layout={ this.AuthenticatedLayout } component={listUsers} />
            <AppRoute exact path='/' layout={ this.AuthenticatedLayout } component={landingPage} />
            <Route path="*" component={error_404}/>
          </Switch>
        </div>
      </Router>
    )
  }

  render () {
    if (this.props.loggedInUserQuery.loading) {
      return (<div><Spin /> Loading</div>)
    }

    if (this.props.loggedInUserQuery.error) {
      console.log(this.props.AllUsers.error)
      return (<div>An unexpected error occurred</div>)
    }

    return (this.appRouter())
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`

export default graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery',
  options: {fetchPolicy: 'network-only'}
})(App)