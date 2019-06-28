import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_DATA_TYPE } from '../../queries/DataTypeQueries';
import { Modal, Form, Input, Button, notification, Divider } from 'antd';
import { QualityAttributesFormGroup } from '../qualityAttributes/QualityAttributesFormGroup'

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
        var classificationIds = Object.keys(values.classification).map(function(key) {
            return {classificationLabelId: values.classification[key]}
        });

        await createDataType({ variables: {
          name: values.name,
          description: values.description,
          classification: classificationIds
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };

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
                destroyOnClose={true}
                title="Create data type"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form {...formItemLayout} >
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

                  <Divider orientation="left">Data classification</Divider>
                  <QualityAttributesFormGroup form={form} scope="DATA" />
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