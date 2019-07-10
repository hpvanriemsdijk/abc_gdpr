import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_QUALITY_ATTRIBUTE } from '../../queries/QualityAttributeQueries';
import { Modal, notification } from 'antd';

class DeleteQualityAttribute extends React.Component {
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
  onDeleteQualityAttribute = DeleteQualityAttribute => {
    DeleteQualityAttribute({ variables: {
      id: this.props.qualityAttribute.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete QualityAttribute",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "QualityAttribute deleted",
      description: "QualityAttribute " + this.props.qualityAttribute.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_QUALITY_ATTRIBUTE}
            refetchQueries={["QualityAttributes"]}
            >
            {(DeleteQualityAttribute, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteQualityAttribute(DeleteQualityAttribute)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.qualityAttribute.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this QualityAttribute, {this.props.qualityAttribute.name} will be removed from the system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteQualityAttribute;