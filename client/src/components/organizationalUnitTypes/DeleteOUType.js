import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_OU_TYPE } from '../../queries/OUTypeQueries';
import { Modal, notification } from 'antd';

class DeleteOUType extends React.Component {
  state = {
    modalVisible: false
  }; 

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  // Modal
  onDeleteOUType = DeleteOUType => {
    DeleteOUType({ variables: {
      id: this.props.OUType.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete Organizational Unit type",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Organizational Unit type deleted",
      description: "Organizational Unit type " + this.props.OUType.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_OU_TYPE}
            refetchQueries={["OrganizationalUnitTypes"]}
            >
            {(DeleteOUType, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteOUType(DeleteOUType)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.OUType.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this Organizational Unit type, {this.props.OUType.name} will be removed from the system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteOUType;