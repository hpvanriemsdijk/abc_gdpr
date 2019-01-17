import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { graphql } from 'react-apollo'

import { Layout, Row, Breadcrumb, Spin } from 'antd';
import 'antd/dist/antd.css';
import '../index.css';

import { userQueries } from '../queries/UserQueries';

import error_404 from './generic/error_404'
import landingPage from './generic/landingPage'
import HeaderMenu from './menu/HeaderMenu'
import LeftMenu from './menu/LeftMenu'
import LoginUser from './users/LoginUser'
import listUsers from './users/ListUsers'
import listOUs from './organizationalUnits/ListOUs'
import viewOU from './organizationalUnits/ViewOU'
import listProcesses from './processes/ListProcesses'
import viewProcess from './processes/ViewProcess'
import listPersons from './persons/ListPersons'
import viewPerson from './persons/ViewPerson'
import listBusinessRoles from './businessRoles/ListBusinessRoles'
import viewBusinessRole from './businessRoles/ViewBusinessRole'
import listProcessingActivities from './processingActivities/ListProcessingActivities'
import viewProcessingActivity from './processingActivities/ViewProcessingActivity'
import listApplications from './applications/ListApplications'
import viewApplication from './applications/ViewApplication'
import listDataTypes from './dataTypes/ListDataTypes'
import viewDataType from './dataTypes/ViewDataType'

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
            <AppRoute path='/units/:ouId' layout={ this.AuthenticatedLayout } component={viewOU} />
            <AppRoute path='/units' layout={ this.AuthenticatedLayout } component={listOUs} />
            <AppRoute path='/processes/:processId' layout={ this.AuthenticatedLayout } component={viewProcess} />
            <AppRoute path='/processes' layout={ this.AuthenticatedLayout } component={listProcesses} />
            <AppRoute path='/persons/:personId' layout={ this.AuthenticatedLayout } component={viewPerson} />
            <AppRoute path='/persons' layout={ this.AuthenticatedLayout } component={listPersons} />
            <AppRoute path='/businessRoles/:businessRoleId' layout={ this.AuthenticatedLayout } component={viewBusinessRole} />
            <AppRoute path='/businessRoles' layout={ this.AuthenticatedLayout } component={listBusinessRoles} />
            <AppRoute path='/processingActivities/:processingActivityId' layout={ this.AuthenticatedLayout } component={viewProcessingActivity} />
            <AppRoute path='/processingActivities' layout={ this.AuthenticatedLayout } component={listProcessingActivities} />
            <AppRoute path='/applications/:applicationId' layout={ this.AuthenticatedLayout } component={viewApplication} />
            <AppRoute path='/applications' layout={ this.AuthenticatedLayout } component={listApplications} />
            <AppRoute path='/dataTypes/:dataTypeId' layout={ this.AuthenticatedLayout } component={viewDataType} />
            <AppRoute path='/dataTypes' layout={ this.AuthenticatedLayout } component={listDataTypes} />
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
      return (
        <div className='w-100 pa4 flex justify-center'>
          <div><Spin /> Loading</div>
        </div>
      )
    }

    if (this.props.loggedInUserQuery.error) {
      console.log(this.props.loggedInUserQuery.error)
      return (<div>An unexpected error occurred</div>)
    }

    return (this.appRouter())
  }
}

export default graphql(userQueries.loggedIn, {
  name: 'loggedInUserQuery',
  options: {fetchPolicy: 'network-only'}
})(App)