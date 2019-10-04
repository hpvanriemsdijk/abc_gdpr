import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_PROCESSING_ACTIVITY, UPDATE_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';
import { ProcessOptionsList } from '../processes/ProcessOptionsList'
import { Modal, Form, Input, notification, Spin } from 'antd';
import { Loading, Error } from '../generic/viewHelpers'

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
        let parentProcess = this.props.processId || values.parentProcess  || null
        parentProcess = process ? {process: {connect: {id: parentProcess }}} : null;

        await updateProcessingActivity({ variables: {
          id: this.props.processingActivity.id,
          data: {
            name: values.name,
            description: values.description,
            purpose: values.purpose,
            ...parentProcess
          }  
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

    return (
      <React.Fragment>
        <Query
          query = { GET_PROCESSING_ACTIVITY }
          variables = {{ id: this.props.processingActivity.id }}
          skip = { !this.state.modalVisible}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error ) return null
            const processingActivity = data?data.processingActivity:[];
            const processId = processingActivity.process ? processingActivity.process.id : null
            const loadingData = loading;

            return(
              <Mutation 
                mutation={UPDATE_PROCESSING_ACTIVITY}
                refetchQueries={["ProcessingActivities", "ProcessingActivity"]}
                >
                {(updateProcessingActivity, { loading }) => {
                  return (
                    <Modal
                      onOk={e => this.onUpdateProcessingActivity(updateProcessingActivity)}
                      onCancel={this.closeModal}
                      title="Update processing activity"
                      confirmLoading={loading}
                      visible={this.state.modalVisible}
                      >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form >
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: processingActivity.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                                ],
                            })(<Input />)}
                          </Form.Item>                        
                          
                          <Form.Item label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: processingActivity.description,
                              rules: [
                                { required: true, message: 'Please enter a description!' }
                                ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item>  
                          
                          <Form.Item label="Purpose">
                            {form.getFieldDecorator('purpose', {
                              initialValue: processingActivity.purpose,
                              rules: [
                                { required: true, message: 'Please enter a purpose!' }
                              ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item>

                          <Form.Item 
                            label="Parent Process">
                            { <ProcessOptionsList form={form} id={processId} /> }
                          </Form.Item>
                        </Form>
                      </Spin>
                    </Modal>
                  )}}
                </Mutation>
              )}}
        </Query>
        <button className="link" onClick={this.showModal}>Edit</button>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateProcessingActivity);