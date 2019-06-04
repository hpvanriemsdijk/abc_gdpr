import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';
import { ProcessOptionsList } from '../processes/ProcessOptionsList'
import { Modal, Form, Input, Button, notification } from 'antd';

class CreateProcessingActivityModal extends React.Component {
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
  onCreateProcessingActivity = createProcessingActivity => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        await createProcessingActivity({ variables: {
          name: values.name,
          description: values.description,
          purpose: values.purpose,
          process: values.parentProcess || this.props.processId || undefined
        }}).catch( res => {
          notification['warning']({
            message: "Could not create Processing activity",
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
          mutation={CREATE_PROCESSING_ACTIVITY}
          refetchQueries={["AllProcessingActivities"]}
          >
          {(createProcessingActivity, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreateProcessingActivity(createProcessingActivity)}
                onCancel={this.closeModal}
                title="Create processing activity"
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
                  <Form.Item label="Description">
                    {form.getFieldDecorator('description', {
                      rules: [
                        { required: true, message: 'Please enter a description!' }
                      ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>
                  <Form.Item label="Purpose">
                    {form.getFieldDecorator('purpose', {
                      rules: [
                        { required: true, message: 'Please enter a purpose!' }
                      ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>
                  <Form.Item 
                    label="Parent Process">
                    { <ProcessOptionsList form={form} /> }
                  </Form.Item>
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          New processing activity
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateProcessingActivityModal);