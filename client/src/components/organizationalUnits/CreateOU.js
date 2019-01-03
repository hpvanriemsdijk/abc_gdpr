import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_OU } from '../../queries/OUQueries';
import { Modal, Form, Input, Button, notification, Checkbox } from 'antd';

class CreateOUModal extends React.Component {
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
  onCreateOU = createOU => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        await createOU({ variables: {
          name: values.name,
          description: values.description,
          legalEntity: values.legalEntity || false
        }}).catch( res => {
          notification['warning']({
            message: "Could not create Organisational Unit",
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
          mutation={CREATE_OU}
          refetchQueries={["AllOrganizationalUnits"]}
          >
          {(createOU, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onCreateOU(createOU)}
                onCancel={this.closeModal}
                title="Create Organizational Unit"
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
                  <Form.Item label="Legal entity">
                    {form.getFieldDecorator('legalEntity', {
                      
                    })(<Checkbox />)}
                  </Form.Item> 
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          New Organizational Unit
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateOUModal);