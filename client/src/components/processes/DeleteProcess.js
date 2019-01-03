import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_PROCESS } from '../../queries/ProcessQueries';
import { Modal, notification } from 'antd';

class DeleteProcess extends React.Component {
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
  onDeleteProcess = DeleteProcess => {
    DeleteProcess({ variables: {
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
            mutation={DELETE_PROCESS}
            refetchQueries={["AllProcesses"]}
            >
            {(DeleteProcess, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteProcess(DeleteProcess)}
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
export default DeleteProcess;