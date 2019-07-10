import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_APPLICATION } from '../../queries/ApplicationQueries';
import { Modal, notification } from 'antd';

class DeleteApplication extends React.Component {
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
  onDeleteApplication = DeleteApplication => {
    DeleteApplication({ variables: {
      id: this.props.application.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete Application",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Application unit deleted",
      description: "Application " + this.props.application.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_APPLICATION}
            refetchQueries={["Applications"]}
            >
            {(DeleteApplication, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteApplication(DeleteApplication)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.application.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this Application, {this.props.application.name} will be removed from the system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteApplication;