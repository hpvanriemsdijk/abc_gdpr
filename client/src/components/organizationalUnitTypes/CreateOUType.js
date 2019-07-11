import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_OU_TYPE } from '../../queries/OUTypeQueries';
import { Modal, Form, Input, Button, notification, Switch } from 'antd';

class CreateOUTypeModal extends React.Component {
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
  onCreateOUType = createOUType => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {

        await createOUType({ variables: {
          data: {
            name: values.name, 
            description: values.description,
            reportingUnit: values.reportingUnit
          }   
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
          mutation={CREATE_OU_TYPE}
          refetchQueries={["OrganizationalUnitType", "OrganizationalUnitTypes"]}
          >
          {(createOUType, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreateOUType(createOUType)}
                onCancel={this.closeModal}
                destroyOnClose={true}
                title="Create organizational unit type"
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

                  <Form.Item label="Reporting unit">
                    {form.getFieldDecorator('reportingUnit')(<Switch />)}
                  </Form.Item>
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          New OU type
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateOUTypeModal);