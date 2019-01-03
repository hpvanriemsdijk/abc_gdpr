import React from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_PROCESS } from '../../queries/ProcessQueries';
import { Modal, Form, Input, notification } from 'antd';

class UpdateProcess extends React.Component {
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
  onUpdateProcess = updateProcess => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateProcess({ variables: {
          id: this.props.organizationalUnit.id,
          name: values.name,
          description: values.description,
          legalEntity: values.legalEntity
        }}).catch( res => {
          notification['warning']({
            message: "Could not update Process",
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
    const ProcessData = this.props.organizationalUnit

    return (
      <React.Fragment>
        <Mutation 
          mutation={UPDATE_PROCESS}
          refetchQueries={["AllProcesses"]}
          >
          {(updateProcess, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onUpdateProcess(updateProcess)}
                onCancel={this.closeModal}
                title="Update organizational unit"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form >
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', {
                      initialValue: ProcessData.name,
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                        ],
                    })(<Input />)}
                  </Form.Item>                        
                  
                  <Form.Item label="Description">
                    {form.getFieldDecorator('description', {
                      initialValue: ProcessData.description,
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
        <a onClick={this.showModal}>edit</a>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateProcess);