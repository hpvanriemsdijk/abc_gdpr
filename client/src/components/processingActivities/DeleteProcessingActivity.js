import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';
import { Modal, notification } from 'antd';

class DeleteProcessingActivity extends React.Component {
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
  onDeleteProcessingActivity = DeleteProcessingActivity => {
    DeleteProcessingActivity({ variables: {
      id: this.props.ProcessingActivity.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete processing Activity",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Processing activity deleted",
      description: "Processing activity " + this.props.ProcessingActivity.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_PROCESSING_ACTIVITY}
            refetchQueries={["ProcessingActivities"]}
            >
            {(DeleteProcessingActivity, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteProcessingActivity(DeleteProcessingActivity)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.ProcessingActivity.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this activity, {this.props.ProcessingActivity.name} will be removed from and system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteProcessingActivity;