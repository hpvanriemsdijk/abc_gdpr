import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_BUSINESSPARTNER } from '../../queries/BusinessPartnerQueries';
import { Modal, Form, Input, Button, notification, Divider } from 'antd';

class CreateBusinessPartnerModal extends React.Component {
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
  onCreateBusinessPartner = createBusinessPartner => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {

        await createBusinessPartner({ variables: {
          data: {
            name: values.name, 
            description: values.description,
            contactDetails: values.contactDetails,
            representative: values.representative,
            dpo: values.dpo,
            headOffice: {
              create: {
                name: values.headOffice.name,
                description: values.headOffice.description,
                address: values.headOffice.address,
              }
            }
          }   
        }}).catch( res => {
          notification['warning']({
            message: "Could not create organisation",
            description: res.message,
            duration: 5
          });
        });

        notification['success']({
          message: "Organisation created",
          duration: 5
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
          mutation={CREATE_BUSINESSPARTNER}
          refetchQueries={["BusinessPartner", "BusinessPartners"]}
          >
          {(createBusinessPartner, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreateBusinessPartner(createBusinessPartner)}
                onCancel={this.closeModal}
                destroyOnClose={true}
                title="Create 3rd party"
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
                    {form.getFieldDecorator('description')(
                      <TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>                  

                  <Form.Item label="DPO">
                    {form.getFieldDecorator('dpo', {
                      rules: [
                        { required: true, message: 'A DPO is required' }
                      ],
                    })(<Input />)}
                  </Form.Item>     

                  <Form.Item label="Contact details">
                    {form.getFieldDecorator('contactDetails', {
                      rules: [
                        { required: true, message: 'Contact details are required' }
                      ],
                    })(<TextArea autosize={{ minRows: 1, maxRows: 3 }} />)}
                  </Form.Item>  

                  <Divider orientation="left">Headoffice location</Divider>

                  <Form.Item label="Office Name">
                    {form.getFieldDecorator('headOffice.name', {
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                      ],
                    })(<Input />)}
                  </Form.Item>  

                  <Form.Item label="Office description">
                    {form.getFieldDecorator('headOffice.description')(<Input />)}
                  </Form.Item>  

                  <Form.Item label="address">
                    {form.getFieldDecorator('headOffice.address', {
                      rules: [
                        { required: true, message: 'Please enter a address!' }
                      ],
                    })(<TextArea autosize={{ minRows: 3, maxRows: 5 }} />)}
                  </Form.Item>  
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          Create 3rd party
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateBusinessPartnerModal);