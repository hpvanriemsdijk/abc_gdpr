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
      id: this.props.process.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete process",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Process unit deleted",
      description: "Process " + this.props.process.name + " is deleted",
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
                  title= { "Are you sure you what to delete " + this.props.process.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this process, {this.props.process.name} will be removed from and system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>
        </React.Fragment>
      );

    }
  }
export default DeleteProcess;