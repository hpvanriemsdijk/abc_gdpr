import React from 'react'
import { Mutation } from 'react-apollo'
import { SET_USER_STATE } from '../../queries/UserQueries';
import { Modal, notification } from 'antd';

class SetUserState extends React.Component {
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
  onDeactivateUser = SetUserState => {
    SetUserState({ variables: {
      id: this.props.user.id,
      active: false
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not create user",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "User deactivated",
      description: "User " + this.props.user.email + " is deactivated",
      duration: 5
    });

    this.closeModal();
  };

  onActivateUser = SetUserState => {
    SetUserState({ variables: {
      id: this.props.user.id,
      active: true
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not create user",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "User activated",
      description: "User " + this.props.user.email + " is activated",
      duration: 5
    });

    this.closeModal();
  };

  render() {
    if (this.props.user.active) {
      return (
        <React.Fragment>
          <Mutation 
            mutation={SET_USER_STATE}
            refetchQueries={["GetUsers"]}
            >
            {(UpdateUser, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeactivateUser(UpdateUser)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to deactiviate " + this.props.user.email}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deactivating this account, {this.props.user.email} won't be able to log-in again. The acount can be reactivated at any moment.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <a onClick={this.showModal}>Deactivate</a>  
        </React.Fragment>
      );
    }else{
      return (
        <React.Fragment>
          <Mutation 
            mutation={SET_USER_STATE}
            refetchQueries={["GetUsers"]}          
            >
            {(UpdateUser, { loading }) => {
              return (
                <a onClick={e => this.onActivateUser(UpdateUser)}>Activate</a> 
              );
            }}
          </Mutation>
        </React.Fragment>
      )
    }
  }
}

export default SetUserState;