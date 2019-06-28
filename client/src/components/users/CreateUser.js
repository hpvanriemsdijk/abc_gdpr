import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_USER } from '../../queries/UserQueries';
import { Modal, Form, Input, Button, notification } from 'antd';

class CreateUserModal extends React.Component {
  state = {
    confirmDirty: false,
    modalVisible: false
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {      
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  // Modal
  onCreateUser = createUser => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await createUser({ variables: {
          email: values.email,
          password: values.password
        }}).catch( res => {
          notification['warning']({
            message: "Could not create user",
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
          mutation={CREATE_USER}
          refetchQueries={["GetUsers"]}
          >
          {(createUser, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onCreateUser(createUser)}
                destroyOnClose={true}
                onCancel={this.closeModal}
                title="Create User"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form>
                  <Form.Item label="E-mail">
                    {form.getFieldDecorator('email', {
                      rules: [
                        { type: 'email', message: 'The input is not valid E-mail!' }, 
                        { required: true, message: 'Please enter an e-mail adress!' }
                        ],
                    })(<Input />)}
                  </Form.Item>                        
                  <Form.Item label="Password">
                    {form.getFieldDecorator('password', {
                      rules: [
                        { validator: this.validateToNextPassword }
                      ],
                    })(<Input type="password" />)}
                  </Form.Item>
                  <Form.Item label="Confirm Password">
                    {form.getFieldDecorator('confirm', {
                      rules: [
                        { validator: this.compareToFirstPassword }
                      ],
                    })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
                  </Form.Item> 
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          New User
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateUserModal);