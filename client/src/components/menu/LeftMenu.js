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
        <SubMenu key="org" title={<span><Icon type="cluster" />Organisation</span>}>
          <Menu.Item key="/units">Organizational units</Menu.Item>
          <Menu.Item key="/processes">Processes</Menu.Item>
          <Menu.Item key="/persons">Persons</Menu.Item>
          <Menu.Item key="/businessRoles">Business roles</Menu.Item>
          <Menu.Item key="/processingActivities">Processing Activities</Menu.Item>
          <Menu.Item key="/applications">Applications</Menu.Item>
          <Menu.Item key="/businessPartners">3rd parties</Menu.Item>
        </SubMenu>
        <SubMenu key="Conf" title={<span><Icon type="tool" />Configuration</span>}>
          <Menu.Item key="/users">User</Menu.Item>
          <Menu.Item key="/dataTypes">Data types</Menu.Item>
          <Menu.Item key="/organizationalUnitTypes">Organizational unit types</Menu.Item>
          <Menu.Item key="/qualityAttributes">Quality attributes</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default withRouter(LeftMenu)