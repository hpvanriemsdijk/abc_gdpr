import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_BUSINESSPARTNER } from '../../queries/BusinessPartnerQueries';
import { Modal, notification } from 'antd';

class DeleteBusinessPartner extends React.Component {
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
  onDeleteBusinessPartner = DeleteBusinessPartner => {
    DeleteBusinessPartner({ variables: {
      id: this.props.BusinessPartner.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete BusinessPartneral Unit type",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "BusinessPartneral Unit type deleted",
      description: "BusinessPartneral Unit type " + this.props.BusinessPartner.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_BUSINESSPARTNER}
            refetchQueries={["BusinessPartners"]}
            >
            {(DeleteBusinessPartner, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeleteBusinessPartner(DeleteBusinessPartner)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.BusinessPartner.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this BusinessPartneral Unit type, {this.props.BusinessPartner.name} will be removed from the system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>  
        </React.Fragment>
      );

    }
  }
export default DeleteBusinessPartner;