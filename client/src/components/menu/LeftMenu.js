import React from 'react'
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom'

const SubMenu = Menu.SubMenu;

class LeftMenu extends React.Component {
  handleClick = (e) => {
    this.props.history.push(e.key);
    return;  
  }

  render() {
    const { location } = this.props;

    return ( 
      <Menu
        mode="inline"
        onClick={this.handleClick}
        onSelect={this.handleSelect}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['org']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <SubMenu key="org" title={<span><Icon type="user" />Organisation</span>}>
          <Menu.Item key="/">home</Menu.Item>
          <Menu.Item key="2">option2</Menu.Item>
          <Menu.Item key="3">option3</Menu.Item>
          <Menu.Item key="4">option4</Menu.Item>
        </SubMenu>
        <SubMenu key="cont" title={<span><Icon type="laptop" />Controls</span>}>
          <Menu.Item key="5">option5</Menu.Item>
          <Menu.Item key="6">option6</Menu.Item>
          <Menu.Item key="7">option7</Menu.Item>
          <Menu.Item key="8">option8</Menu.Item>
        </SubMenu>
        <SubMenu key="Conf" title={<span><Icon type="notification" />Configuration</span>}>
          <Menu.Item key="/users">User</Menu.Item>
          <Menu.Item key="/settings">Settings</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default withRouter(LeftMenu)