import React from 'react'
import Moment from 'react-moment';
import { Icon, Tag, Tooltip, Drawer, Card, Row, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom'

const ObjectModifiedDate = obj => {
    let {createdAt, updatedAt} = obj.children;

    return(
        <span>
        <Tooltip title="Created at">
            <Tag>
            <Icon type="plus-circle" />&nbsp;
            <Moment format="MMM Do YYYY - HH:mm:ss">
                {createdAt}
            </Moment>
            </Tag>
        </Tooltip>
        <Tooltip title="Updated at">
            <Tag>
            <Icon type="edit" />&nbsp;
            <Moment format="MMM Do YYYY - HH:mm:ss">
                {updatedAt}
            </Moment>
            </Tag>
        </Tooltip>
        </span>
    )
}

class InfoLink extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render () { 
    let {label, linkPath, id, Component} = this.props.target;

    return(
      <React.Fragment>  
        <button key={id} className="link" onClick={this.showDrawer}>{label}</button> <Link to={`${linkPath}/${id}`}><Icon type="link" /></Link>
        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ padding: 0 }}
          >
          
          <Component id={id} simplefied={true} />
        </Drawer>
      </React.Fragment>  
    )
  }
}

class ShowInDrawer extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render () { 
    let {id, Component, children} = this.props;

    return(
      <React.Fragment>  
        <button key={id} className="link" onClick={this.showDrawer}>{children}</button>
        <Drawer
          width={640}
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ padding: 0 }}
          >
          
          <Component id={id} />
        </Drawer>
      </React.Fragment>  
    )
  }
}

function Loading(){
  return(
    <Card><Row type="flex" justify="center"><Spin tip="Loading..."/></Row></Card>
  )
}

function Error(){
  return(
    <Card><Empty>Oeps, error..</Empty></Card>     
  )
}

export { ObjectModifiedDate, InfoLink, ShowInDrawer, Loading, Error };