import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_OU_TYPE, UPDATE_OU_TYPE } from '../../queries/OUTypeQueries';
import { Modal, Form, Input, notification, Spin, Button, Switch  } from 'antd';

class UpdateOUType extends React.Component {
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
  onUpdateOUType = updateOUType => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateOUType({ variables: {
          id: this.props.OUType.id, 
          data: {
            name: values.name, 
            description: values.description,
            reportingUnit: values.reportingUnit
          }   
        }}).catch( res => {
          notification['warning']({
            message: "Could not update OUType",
            description: res.message,
            duration: 5
          });
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
          query = { GET_OU_TYPE }
          variables = {{ id: this.props.OUType.id }}
          skip = { !this.state.modalVisible}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error ) return null
            const OUType = data?data.organizationalUnitType:[];
            const loadingData = loading;

            return(
              <Mutation 
                mutation={UPDATE_OU_TYPE}
                refetchQueries={["OrganizationalUnitType", "OrganizationalUnitTypes"]}
                >
                {(updateOUType, { loading }) => {
                  return (
                    <Modal
                      onOk={e => this.onUpdateOUType(updateOUType)}
                      onCancel={this.closeModal}
                      title="Update organizational unit type"
                      confirmLoading={loading}
                      visible={this.state.modalVisible}
                      >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form {...formItemLayout} >
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: OUType.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                                ],
                            })(<Input />)}
                          </Form.Item>   
                          
                          <Form.Item label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: OUType.description,
                              rules: [
                                { required: true, message: 'Please enter a description!' }
                                ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item> 

                          <Form.Item label="Reporting unit">
                            {form.getFieldDecorator('reportingUnit', {
                              valuePropName: 'checked',
                              initialValue: OUType.reportingUnit,
                              })(<Switch />)}
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

export default Form.create()(UpdateOUType);