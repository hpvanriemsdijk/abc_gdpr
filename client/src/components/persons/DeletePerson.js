import React from 'react'
import { Mutation } from 'react-apollo'
import { DELETE_PERSON } from '../../queries/PersonQueries';
import { Modal, notification } from 'antd';

class DeletePerson extends React.Component {
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
  onDeletePerson = DeletePerson => {
    DeletePerson({ variables: {
      id: this.props.person.id
    }}).catch( res => {
      if ( res.graphQLErrors ) {
        console.log('Received error: ', res.message);
        notification['warning']({
          message: "Could not delete person",
          description: res.message,
          duration: 10
        });
      }
    });

    notification['success']({
      message: "Person deleted",
      description: "Person " + this.props.person.name + " is deleted",
      duration: 5
    });

    this.closeModal();
  };

  render() {
      return (
        <React.Fragment>
          <Mutation 
            mutation={DELETE_PERSON}
            refetchQueries={["Persons"]}
            >
            {(DeletePerson, { loading }) => {
              return (
                <Modal
                  onOk={e => this.onDeletePerson(DeletePerson)}
                  okType = 'danger'
                  onCancel={this.closeModal}
                  title= { "Are you sure you what to delete " + this.props.person.surname + " " + this.props.person.name}
                  confirmLoading={loading}
                  visible={this.state.modalVisible}
                >
                <div>By deleting this person, {this.props.person.surname} {this.props.person.name} will be removed from and system, this is unrecoverable.</div>               
                </Modal>
              );
            }}
          </Mutation>
          <button className="link" onClick={this.showModal}>Delete</button>
        </React.Fragment>
      );

    }
  }
export default DeletePerson;