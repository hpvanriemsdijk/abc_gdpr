import React from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_APPLICATION } from '../../queries/ApplicationQueries';
import { Modal, Form, Input, notification, Select } from 'antd';

class UpdateApplication extends React.Component {
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
  onUpdateApplication = updateApplication => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateApplication({ variables: {
          id: this.props.application.id,
          name: values.name,
          description: values.description,
          alias: values.alias
        }}).catch( res => {
          notification['warning']({
            message: "Could not update Application",
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
    const ApplicationData = this.props.application

    return (
      <React.Fragment>
        <Mutation 
          mutation={UPDATE_APPLICATION}
          refetchQueries={["AllApplications"]}
          >
          {(updateApplication, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onUpdateApplication(updateApplication)}
                onCancel={this.closeModal}
                title="Update Application"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form >
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', {
                      initialValue: ApplicationData.name,
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                        ],
                    })(<Input />)}
                  </Form.Item>       

                  <Form.Item 
                    label="Alias"
                    extra="Seperate alisasses with the , character.">
                    {form.getFieldDecorator('alias',{
                      initialValue: ApplicationData.alias})(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        tokenSeparators={[',']}
                      ></Select>
                      )}
                  </Form.Item>                  
                  
                  <Form.Item label="Description">
                    {form.getFieldDecorator('description', {
                      initialValue: ApplicationData.description,
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
        <a onClick={this.showModal}>Edit</a>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateApplication);