import React from 'react'
import { Layout, Menu, Icon, Spin } from 'antd';
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { userQueries } from 'queries/UserQueries';
import { logout } from 'services/Actions'

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class HeaderMenu extends React.Component {
  _logout = () => {
    logout()
  }

  render() {
    if (this.props.loggedInUserQuery.loading) {
      return (<div><Spin /> Loading</div>)
    }

    return ( 
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[]}
          style={{ lineHeight: '64px', float: 'right' }}
        >
          <SubMenu title={<span><Icon type="user" />{this.props.loggedInUserQuery.loggedInUser.email} </span>} >
              <Menu.Item> 
                <a className='dib bg-red white pa3 pointer dim' onClick={this._logout}>Logout</a> 
              </Menu.Item>
              <Menu.Item>
                <Link to="/users">My profile</Link>
              </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
    )
  }
}

export default graphql(userQueries.loggedIn, {
  name: 'loggedInUserQuery'
})(HeaderMenu)