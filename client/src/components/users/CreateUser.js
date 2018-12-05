import React from 'react'
import { graphql, compose } from 'react-apollo'
import { userQueries, userEnums } from '../../queries/UserQueries';
import { Modal, Form, Input, Icon, Checkbox, notification } from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

/*
  firstName: String
  lastName: String
  email: String! @isUnique
  active: Boolean! @defaultValue(value: true) @migrationValue(value: true)
  password: String!

  permissions: [SpecialPermissions!] @migrationValue(value: [])
*/
const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Add new user"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
           <FormItem label="E-mail">
              {getFieldDecorator('email', {
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
                valuePropName: 'checked',
                initialValue: true,
                })(
                  <CheckboxGroup options={userEnums.specialPermissions} />
                )}              
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class CreateUser extends React.Component {
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({ visible: false });
  }
  handleCreate = async () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
    })
    try {
      const user = await this.props.CreateUserMutation({variables: form})
      form.resetFields();
      this.setState({ visible: false });
    } catch (e) {
      console.log(e.message)
      notification['warning']({
        message: "Could not create user",
        description: e.message,
        duration: 10
      });
    }
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  render() {
    return (
      <div>
        <a onClick={this.showModal}><Icon type="user-add" />Add user</a>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default compose(
  graphql(userQueries.create, {name: 'CreateUserMutation'}),
)(CreateUser)