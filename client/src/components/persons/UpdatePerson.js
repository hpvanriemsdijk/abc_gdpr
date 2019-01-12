import React from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_PERSON } from '../../queries/PersonQueries';
import { Modal, Form, Input, notification } from 'antd';

class UpdatePerson extends React.Component {
  state = {
    confirmDirty: false,
    modalVisible: false
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  // Modal
  onUpdatePerson = updatePerson => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updatePerson({ variables: {
          id: this.props.organizationalUnit.id,
          name: values.name,
          description: values.description,
        }}).catch( res => {
          notification['warning']({
            message: "Could not update Person",
            description: res.message,
            duration: 5
          });
        });
        this.closeModal();
        form.resetFields();
      }
    });
  };

  render() {
    const { form } = this.props;
    const PersonData = this.props.person

    return (
      <React.Fragment>
        <Mutation 
          mutation={UPDATE_PERSON}
          refetchQueries={["AllPersons"]}
          >
          {(updatePerson, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onUpdatePerson(updatePerson)}
                onCancel={this.closeModal}
                title="Update Person"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form >
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', {
                      initialValue: PersonData.name,
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                        ],
                    })(<Input />)}
                  </Form.Item>                        
                  
                  <Form.Item label="Surname">
                    {form.getFieldDecorator('surname', {
                      initialValue: PersonData.surname,
                      rules: [
                        { required: true, message: 'Please enter a surname!' }
                        ],
                    })(<Input />)}
                  </Form.Item>  

                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <button className="link" onClick={this.showModal}>Edit</button>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdatePerson);