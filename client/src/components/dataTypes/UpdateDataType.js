import React from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_DATA_TYPE } from '../../queries/DataTypeQueries';
import { Modal, Form, Input, notification, Checkbox } from 'antd';

class UpdateDataType extends React.Component {
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
  onUpdateDataType = updateDataType => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateDataType({ variables: {
          id: this.props.dataType.id,
          name: values.name,
          description: values.description,
          pii: values.pii,
          spii: values.spii
        }}).catch( res => {
          notification['warning']({
            message: "Could not update DataType",
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
    const DataTypeData = this.props.dataType

    return (
      <React.Fragment>
        <Mutation 
          mutation={UPDATE_DATA_TYPE}
          refetchQueries={["AllDataTypes"]}
          >
          {(updateDataType, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onUpdateDataType(updateDataType)}
                onCancel={this.closeModal}
                title="Update data type"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form >
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', {
                      initialValue: DataTypeData.name,
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                        ],
                    })(<Input />)}
                  </Form.Item>   
                  
                  <Form.Item label="Description">
                    {form.getFieldDecorator('description', {
                      initialValue: DataTypeData.description,
                      rules: [
                        { required: true, message: 'Please enter a description!' }
                        ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>  

                  <Form.Item label="Personal data">
                    {form.getFieldDecorator('pii', {
                      valuePropName: "checked",
                      initialValue : DataTypeData.pii
                    })(<Checkbox />)}
                  </Form.Item>  
                  <Form.Item label="Sensitive personal data">
                    {form.getFieldDecorator('spii', {
                      valuePropName: "checked",
                      initialValue : DataTypeData.spii
                    })(<Checkbox />)}
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

export default Form.create()(UpdateDataType);