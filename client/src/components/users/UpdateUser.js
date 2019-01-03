import React from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_USER, userEnums } from '../../queries/UserQueries';
import { Modal, Form, Input, notification, Checkbox } from 'antd';

class UpdateUser extends React.Component {
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
  onUpdateUser = updateUser => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateUser({ variables: {
          id: this.props.user.id,
          email: values.email,
          specialPermissions: values.specialPermissions
        }}).catch( res => {
          notification['warning']({
            message: "Could not update user",
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
    const userData = this.props.user
    const CheckboxGroup = Checkbox.Group;

    return (
      <React.Fragment>
        <Mutation 
          mutation={UPDATE_USER}
          refetchQueries={["GetUsers"]}
          >
          {(updateUser, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onUpdateUser(updateUser)}
                onCancel={this.closeModal}
                title="Update User"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form>
                  <Form.Item label="E-mail">
                    {form.getFieldDecorator('email', {
                      initialValue: userData.email,
                      rules: [
                        { type: 'email', message: 'The input is not valid E-mail!' }, 
                        { required: true, message: 'Please enter an e-mail adress!' }
                        ],
                    })(<Input />)}
                  </Form.Item>                        
                  
                  <Form.Item label="Special permissions">
                    {form.getFieldDecorator('specialPermissions', {
                      initialValue: userData.specialPermissions,
                      })(
                        <CheckboxGroup 
                          options={userEnums.specialPermissions}
                          />
                      )}              
                  </Form.Item>
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <a onClick={this.showModal}>edit</a>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateUser);