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
    const module = '/'+location.pathname.split("/")[1];

    return (
      <Menu
        mode="inline"
        onClick={this.handleClick}
        onSelect={this.handleSelect}
        selectedKeys={[module]}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="/"><span><Icon type="home" />Home</span></Menu.Item>
        <SubMenu key="org" title={<span><Icon type="user" />Organisation</span>}>
          <Menu.Item key="/units">Organizational units</Menu.Item>
          <Menu.Item key="/processes">Processes</Menu.Item>
        </SubMenu>
        <SubMenu key="Conf" title={<span><Icon type="notification" />Configuration</span>}>
          <Menu.Item key="/users">User</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default withRouter(LeftMenu)