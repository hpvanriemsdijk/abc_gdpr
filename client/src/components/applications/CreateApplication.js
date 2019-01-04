import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_APPLICATION } from '../../queries/ApplicationQueries';
import { Modal, Form, Input, Button, notification, Select } from 'antd';

class CreateApplicationModal extends React.Component {
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
  onCreateApplication = createApplication => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        await createApplication({ variables: {
          name: values.name,
          description: values.description,
          alias: values.alias
        }}).catch( res => {
          notification['warning']({
            message: "Could not create Application",
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
    const { TextArea } = Input;

    return (
      <React.Fragment>
        <Mutation 
          mutation={CREATE_APPLICATION}
          refetchQueries={["AllApplications"]}
          >
          {(createApplication, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onCreateApplication(createApplication)}
                onCancel={this.closeModal}
                title="Create Application"
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
                  <Form.Item 
                    label="Alias"
                    extra="Seperate alisasses with the , character."
                    >
                    {form.getFieldDecorator('alias')(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        tokenSeparators={[',']}
                      ></Select>
                      )}
                  </Form.Item>                    
                  <Form.Item 
                    label="Description">
                    {form.getFieldDecorator('description', {
                      rules: [
                        { required: true, message: 'Please enter a description!' }
                      ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          New Application
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateApplicationModal);