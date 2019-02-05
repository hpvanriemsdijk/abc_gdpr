import React from 'react'
import Moment from 'react-moment';
import { Icon, Tag, Tooltip, Drawer } from 'antd';
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

export { ObjectModifiedDate, InfoLink };