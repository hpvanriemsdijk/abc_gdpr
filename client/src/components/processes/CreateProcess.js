import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_PROCESS } from '../../queries/ProcessQueries';
import { ProcessesParentTree } from '../processes/ProcessesParentTree'
import { BusinessRolessOptionsList } from '../businessRoles/BusinessRolessOptionsList'
import { Modal, Form, Input, Button, notification } from 'antd';

class CreateProcessModal extends React.Component {
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
  onCreateProcess = createProcess => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        await createProcess({ variables: {
          name: values.name,
          description: values.description,
          parent: values.process,
          processOwner: values.processOwner
        }}).catch( res => {
          notification['warning']({
            message: "Could not create Process",
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
            mutation={CREATE_PROCESS}
            refetchQueries={["AllProcesses"]}
            >
            {(createProcess, { loading, error, data }) => {
              return (
                <Modal
                  onOk={e => this.onCreateProcess(createProcess)}
                  onCancel={this.closeModal}
                  title="Create process"
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

                    <Form.Item 
                      label="Parent proces"
                      extra="Can't select yourself, childeren in own line or result in 3+ levels.">
                      { <ProcessesParentTree form={form} /> }
                    </Form.Item>
                    
                    <Form.Item 
                      label="Process owner">
                      { <BusinessRolessOptionsList form={form} /> }
                    </Form.Item>
                  </Form>
                </Modal>
              );
            }}
          </Mutation>
        <Button onClick={this.showModal} type="primary">
          New Process
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateProcessModal);