import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_USER } from '../../queries/UserQueries';
import { Modal, notification } from 'antd';

class DeleteUser extends React.Component {
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
  onDeleteUser = DeleteUser => {
    DeleteUser({ variables: {
      id: this.props.user.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete user",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "User deleted",
      description: "User " + this.props.user.email + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_USER}
            refetchQueries={["GetUsers"]}
            >
            {(DeleteUser, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteUser(DeleteUser)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.user.email}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this account, {this.props.user.email} will be removed from and system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteUser;