import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_DATA_TYPE } from '../../queries/DataTypeQueries';
import { Modal, notification } from 'antd';

class DeleteDataType extends React.Component {
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
  onDeleteDataType = DeleteDataType => {
    DeleteDataType({ variables: {
      id: this.props.dataType.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete data type",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Data type deleted",
      description: "Data type " + this.props.dataType.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_DATA_TYPE}
            refetchQueries={["AllDataTypes"]}
            >
            {(DeleteDataType, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteDataType(DeleteDataType)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.dataType.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this data type, {this.props.dataType.name} will be removed from the system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>
        </React.Fragment>
      );

    }
  }
export default DeleteDataType;