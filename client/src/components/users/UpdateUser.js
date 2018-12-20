/*
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { userQueries, userEnums } from '../../queries/UserQueries';
import { Modal, Form, Input, Checkbox, notification } from 'antd';

const FormItem = Form.Item;
const UserUpdateForm = Form.create()(
  class extends React.Component {

    render() {
      const { visible, onCancel, onUpdate, form, userData } = this.props;
      const { getFieldDecorator } = form;
      const CheckboxGroup = Checkbox.Group;

      return (
        <Modal
          visible={visible}
          title="Update user"
          okText="Update"
          onCancel={onCancel}
          onOk={onUpdate}
        >
          <Form layout="vertical">
           <FormItem label="E-mail">
              {getFieldDecorator('email', {
                initialValue: userData.email,
                rules: [
                  { type: 'email', message: 'The input is not valid E-mail!' }, 
                  { required: true, message: 'Please enter an e-mail adress!' }
                  ],
              })(
                <Input />
              )}
            </FormItem>
    
            <FormItem label="Special permissions">
              {getFieldDecorator('specialPermissions', {
                initialValue: userData.specialPermissions,
                })(
                  <CheckboxGroup 
                    options={userEnums.specialPermissions}
                    />
                )}              
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class UpdateUser extends React.Component {
  //Add loader after submitting https://ant.design/components/modal/

  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    console.log('cancel');

    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({ visible: false });
  }

  handleUpdate = async () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received error: ', err);
        return;
      }else{
        this.props.UpdateUserMutation({
          variables: {
            id: this.props.user.id,
            email: values.email,
            specialPermissions: values.specialPermissions
          }
        }).catch( res => {
          if ( res.graphQLErrors ) {
            console.log('Received error: ', res.message);
            notification['warning']({
              message: "Could not create user",
              description: res.message,
              duration: 10
            });
          }
        });

        form.resetFields();
        this.setState({ visible: false });
      }
    })
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    return (
      <span>
        <a onClick={this.showModal}>edit</a>
        <UserUpdateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onUpdate={this.handleUpdate}
          userData={this.props.user}
        />
      </span>
    );
  }
}

export default compose(
  graphql(userQueries.update, {
    name: 'UpdateUserMutation'
  })
)(UpdateUser)

*/

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