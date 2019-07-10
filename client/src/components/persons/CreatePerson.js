import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_PERSON } from '../../queries/PersonQueries';
import { Modal, Form, Input, Button, notification } from 'antd';

class CreatePersonModal extends React.Component {
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
  onCreatePerson = createPerson => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        await createPerson({ variables: {
          data: {
            name: values.name,
            surname: values.surname,
            description: values.description,
          }   
        }}).catch( res => {
          notification['warning']({
            message: "Could not create Person",
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

    return (
      <React.Fragment>
        <Mutation 
          mutation={CREATE_PERSON}
          refetchQueries={["Persons"]}
          >
          {(createPerson, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreatePerson(createPerson)}
                destroyOnClose={true}
                onCancel={this.closeModal}
                title="Create Person"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form layout="horizontal">
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', {
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                      ],
                    })(<Input />)}
                  </Form.Item>                        
                  <Form.Item label="Surname">
                    {form.getFieldDecorator('surname', {
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
        <Button onClick={this.showModal} type="primary">
          New Person
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreatePersonModal);