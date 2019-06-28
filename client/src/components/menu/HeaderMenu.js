import React from 'react'
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
import { logout } from '../../services/Actions'
import decode from "jwt-decode";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class HeaderMenu extends React.Component {
  getUser(){
    const token = localStorage.getItem('id_token')
    if(token){
      try {
        const decoded = decode(token);
        return decoded;
      } catch (err) {
        console.log("Can't read email from JWT");
      }
    }; 
  }

  render() {
    return ( 
      <Header className="header">
        <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[]}
            style={{ lineHeight: '64px', float: 'right' }}
            >
            <SubMenu title={<span><Icon type="user" />{this.getUser().email} </span>} >
                <Menu.Item> 
                  <button className='link' onClick={() => logout()} >Logout</button> 
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

export default HeaderMenu