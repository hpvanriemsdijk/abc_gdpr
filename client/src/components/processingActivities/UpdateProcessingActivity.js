import React from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';
import { Modal, Form, Input, notification } from 'antd';

class UpdateProcessingActivity extends React.Component {
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
  onUpdateProcessingActivity = updateProcessingActivity => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateProcessingActivity({ variables: {
          id: this.props.processingActivity.id,
          name: values.name,
          description: values.description,
          purpose: values.purpose,
        }}).catch( res => {
          notification['warning']({
            message: "Could not update processing activity",
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
    const ProcessingActivityData = this.props.processingActivity

    return (
      <React.Fragment>
        <Mutation 
          mutation={UPDATE_PROCESSING_ACTIVITY}
          refetchQueries={["AllProcessingActivities"]}
          >
          {(updateProcessingActivity, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onUpdateProcessingActivity(updateProcessingActivity)}
                onCancel={this.closeModal}
                title="Update processing activity"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form >
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', {
                      initialValue: ProcessingActivityData.name,
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                        ],
                    })(<Input />)}
                  </Form.Item>                        
                  
                  <Form.Item label="Description">
                    {form.getFieldDecorator('description', {
                      initialValue: ProcessingActivityData.description,
                      rules: [
                        { required: true, message: 'Please enter a description!' }
                        ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>  
                  
                  <Form.Item label="Purpose">
                    {form.getFieldDecorator('purpose', {
                      initialValue: ProcessingActivityData.purpose,
                      rules: [
                        { required: true, message: 'Please enter a purpose!' }
                      ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
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

export default Form.create()(UpdateProcessingActivity);