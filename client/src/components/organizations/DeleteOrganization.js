import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_ORGANIZATION } from '../../queries/OrganizationQueries';
import { Modal, notification } from 'antd';

class DeleteOrganization extends React.Component {
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
  onDeleteOrganization = DeleteOrganization => {
    DeleteOrganization({ variables: {
      id: this.props.Organization.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete Organizational Unit type",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Organizational Unit type deleted",
      description: "Organizational Unit type " + this.props.Organization.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_ORGANIZATION}
            refetchQueries={["Organizations"]}
            >
            {(DeleteOrganization, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteOrganization(DeleteOrganization)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.Organization.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this Organizational Unit type, {this.props.Organization.name} will be removed from the system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteOrganization;