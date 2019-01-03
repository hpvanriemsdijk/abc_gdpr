import React from 'react'
import { Layout, Menu, Icon, Spin } from 'antd';
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { LOGGEDIN_USER } from '../../queries/UserQueries';
import { logout } from '../../services/Actions'

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class HeaderMenu extends React.Component {
  _logout = () => {
    logout()
  }

  render() {
    return ( 
      <Header className="header">
        <div className="logo" />
          <Query query = { LOGGEDIN_USER } >
            {({ loading, data }) => {
              if (loading) {return (<div className="loader"><Spin /> Loading</div>)}
              
              return(
                <Menu
                  theme="dark"
                  mode="horizontal"
                  selectedKeys={[]}
                  style={{ lineHeight: '64px', float: 'right' }}
                  >
                  <SubMenu title={<span><Icon type="user" />{data.loggedInUser.email} </span>} >
                      <Menu.Item> 
                        <a className='dib bg-red white pa3 pointer dim' onClick={this._logout}>Logout</a> 
                      </Menu.Item>
                      <Menu.Item>
                        <Link to="/users">My profile</Link>
                      </Menu.Item>
                  </SubMenu>
                </Menu>
              )
            }
          }
          </Query>
        
      </Header>
    )
  }
}

export default HeaderMenu