import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_OU } from '../../queries/OUQueries';
import { Modal, notification } from 'antd';

class DeleteOU extends React.Component {
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
  onDeleteOU = DeleteOU => {
    DeleteOU({ variables: {
      id: this.props.organizationalUnit.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete organizational unit",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Organizational unit deleted",
      description: "Organizational unit " + this.props.organizationalUnit.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_OU}
            refetchQueries={["AllOrganizationalUnits"]}
            >
            {(DeleteOU, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteOU(DeleteOU)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.organizationalUnit.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this account, {this.props.organizationalUnit.name} will be removed from and system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <a onClick={this.showModal}>Delete</a>  
        </React.Fragment>
      );

    }
  }
export default DeleteOU;