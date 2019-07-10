import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_BUSINESS_ROLE } from '../../queries/BusinessRoleQueries';
import { Modal, notification } from 'antd';

class DeleteBusinessRole extends React.Component {
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
  onDeleteBusinessRole = DeleteBusinessRole => {
    DeleteBusinessRole({ variables: {
      id: this.props.businessRole.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete business role",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Business role deleted",
      description: "Business role " + this.props.businessRole.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_BUSINESS_ROLE}
            refetchQueries={["BusinessRoles", "BusinessRoleByOu"]}
            >
            {(DeleteBusinessRole, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteBusinessRole(DeleteBusinessRole)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.businessRole.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this role, {this.props.businessRole.name} will be removed from and system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteBusinessRole;