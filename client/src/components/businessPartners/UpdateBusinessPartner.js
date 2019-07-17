import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_BUSINESSPARTNER, UPDATE_BUSINESSPARTNER } from '../../queries/BusinessPartnerQueries';
import { Modal, Form, Input, notification, Spin, Button, Divider  } from 'antd';

class UpdateBusinessPartner extends React.Component {
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
  onUpdateBusinessPartner = updateBusinessPartner => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateBusinessPartner({ variables: {
          id: this.props.BusinessPartner.id, 
          data: {
            name: values.name, 
            description: values.description,
            representative: values.representative,
            contactDetails: values.contactDetails,
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
            message: "Could not update BusinessPartner",
            description: res.message,
            duration: 5
          });
        });

        notification['success']({
          message: "Organisation updated",
          duration: 5
        });

        this.closeModal();
        form.resetFields();
      }
    });
  };

  isDisabled = () => {
    if(this.state.modalVisible){
      return 'disabled'
    }
  }

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
        <Query
          query = { GET_BUSINESSPARTNER }
          variables = {{ id: this.props.BusinessPartner.id }}
          skip = { !this.state.modalVisible}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error ) return null
            const BusinessPartner = data.businessPartner || {headOffice:[]};
            const loadingData = loading;

            return(
              <Mutation 
                mutation={UPDATE_BUSINESSPARTNER}
                refetchQueries={["BusinessPartner", "BusinessPartners"]}
                >
                {(updateBusinessPartner, { loading }) => {
                  return (
                    <Modal
                      onOk={e => this.onUpdateBusinessPartner(updateBusinessPartner)}
                      onCancel={this.closeModal}
                      title="Update businessPartneral unit type"
                      confirmLoading={loading}
                      visible={this.state.modalVisible}
                      >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form {...formItemLayout} >
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: BusinessPartner.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                                ],
                            })(<Input />)}
                          </Form.Item>   
                          
                          <Form.Item label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: BusinessPartner.description,
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item> 

                          <Form.Item label="Representative">
                            {form.getFieldDecorator('representative', {
                              initialValue: BusinessPartner.representative,
                              rules: [
                                { required: true, message: 'A representative is required' }
                              ],
                            })(<Input />)}
                          </Form.Item>   

                          <Form.Item label="DPO">
                            {form.getFieldDecorator('dpo', {
                              initialValue: BusinessPartner.dpo,
                              rules: [
                                { required: true, message: 'A DPO is required' }
                              ],
                            })(<Input />)}
                          </Form.Item>    

                          <Form.Item label="Contact details">
                            {form.getFieldDecorator('contactDetails', {
                              initialValue: BusinessPartner.contactDetails,
                              rules: [
                                { required: true, message: 'Contact details are required' }
                              ],
                            })(<TextArea autosize={{ minRows: 1, maxRows: 3 }} />)}
                          </Form.Item>  

                          <Divider orientation="left">Headoffice location</Divider>

                          <Form.Item label="Office Name">
                            {form.getFieldDecorator('headOffice.name', {
                              initialValue: BusinessPartner.headOffice.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                              ],
                            })(<Input />)}
                          </Form.Item>  

                          <Form.Item label="Office description">
                            {form.getFieldDecorator('headOffice.description', {
                              initialValue: BusinessPartner.headOffice.description,
                            })(<Input />)}
                          </Form.Item>  

                          <Form.Item label="address">
                            {form.getFieldDecorator('headOffice.address', {
                              initialValue: BusinessPartner.headOffice.address,
                              rules: [
                                { required: true, message: 'Please enter a address!' }
                              ],
                            })(<TextArea autosize={{ minRows: 3, maxRows: 5 }} />)}
                          </Form.Item>  
                        </Form>
                      </Spin>
                    </Modal>
                  );
                }}
              </Mutation>
            )}}
          </Query>
        <Button className="link" onClick={this.showModal} >Edit</Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateBusinessPartner);