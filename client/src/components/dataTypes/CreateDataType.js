import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_DATA_TYPE } from '../../queries/DataTypeQueries';
import { Modal, Form, Input, Button, notification, Checkbox } from 'antd';

class CreateDataTypeModal extends React.Component {
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
  onCreateDataType = createDataType => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        await createDataType({ variables: {
          name: values.name,
          description: values.description,
          pii: values.pii,
          spii: values.spii
        }}).catch( res => {
          notification['warning']({
            message: "Could not create DataType",
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
          mutation={CREATE_DATA_TYPE}
          refetchQueries={["AllDataTypes"]}
          >
          {(createDataType, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreateDataType(createDataType)}
                onCancel={this.closeModal}
                title="Create data type"
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
                    label="Description">
                    {form.getFieldDecorator('description', {
                      rules: [
                        { required: true, message: 'Please enter a description!' }
                      ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>

                  <Form.Item label="Personal data">
                    {form.getFieldDecorator('pii')(<Checkbox />)}
                  </Form.Item>  
                  
                  <Form.Item label="Sensitive personal data">
                    {form.getFieldDecorator('spii')(<Checkbox />)}
                  </Form.Item>  
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          New data type
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateDataTypeModal);