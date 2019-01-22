import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_BUSINESS_ROLE, UPDATE_BUSINESS_ROLE, businessRolesEnums } from '../../queries/BusinessRoleQueries';
import { Modal, Form, Input, notification, Radio } from 'antd';

class UpdateBusinessRole extends React.Component {
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
  onUpdateBusinessRole = updateBusinessRole => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateBusinessRole({ variables: {
          id: this.props.businessRole.id,
          name: values.name,
          description: values.description,
          raciExecutive: values.raciExecutive || null,
          raciFinancial: values.raciFinancial || null,
          raciSecurity: values.raciSecurity || null,
          raciPrivacy: values.raciPrivacy || null
        }}).catch( res => {
          notification['warning']({
            message: "Could not update Business Role",
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
        <Query
          query = { GET_BUSINESS_ROLE }
          variables = {{ id: this.props.businessRole.id }}
          skip = { !this.state.modalVisible}
          >
          {({ loading, data }) => {
            if( !this.state.modalVisible ) return null
          
            const BusinessRoleData = data.BusinessRole || [];
            var loadingBusinessRole = loading;
            return(
              <Mutation 
                mutation={UPDATE_BUSINESS_ROLE}
                refetchQueries={["AllBusinessRoles"]}
                >
                {(updateBusinessRole, { loading, error, data }) => {
                  return (
                    <Modal
                      onOk={e => this.onUpdateBusinessRole(updateBusinessRole)}
                      onCancel={this.closeModal}
                      title="Update Business role"
                      confirmLoading={loading}
                      loading={loadingBusinessRole}
                      visible={this.state.modalVisible}
                    >
                      <Form >
                        <Form.Item label="Name">
                          {form.getFieldDecorator('name', {
                            initialValue: BusinessRoleData.name,
                            rules: [
                              { required: true, message: 'Please enter a name!' }
                              ],
                          })(<Input />)}
                        </Form.Item>                        
                        
                        <Form.Item label="Description">
                          {form.getFieldDecorator('description', {
                            initialValue: BusinessRoleData.description,
                            rules: [
                              { required: true, message: 'Please enter a description!' }
                              ],
                          })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                        </Form.Item> 

                        <Form.Item label="Executive responsibility">
                          {form.getFieldDecorator('raciExecutive', {
                            initialValue: BusinessRoleData.raciExecutive || undefined
                          })(
                              <Radio.Group buttonStyle="solid">
                                {businessRolesEnums.raci.map(raci => <Radio.Button key={raci.value} value={raci.value || undefined}>{raci.label}</Radio.Button>)}
                              </Radio.Group>
                            )}              
                        </Form.Item>

                        <Form.Item label="Financial responsibility">
                          {form.getFieldDecorator('raciFinancial', {
                            initialValue: BusinessRoleData.raciFinancial || undefined
                          })(
                              <Radio.Group buttonStyle="solid">
                                {businessRolesEnums.raci.map(raci => <Radio.Button key={raci.value} value={raci.value || undefined}>{raci.label}</Radio.Button>)}
                              </Radio.Group>
                            )}              
                        </Form.Item>

                        <Form.Item label="Security responsibility">
                          {form.getFieldDecorator('raciSecurity', {
                            initialValue: BusinessRoleData.raciSecurity || undefined
                          })(
                              <Radio.Group buttonStyle="solid">
                                {businessRolesEnums.raci.map(raci => <Radio.Button key={raci.value} value={raci.value || undefined}>{raci.label}</Radio.Button>)}
                              </Radio.Group>
                            )}              
                        </Form.Item>

                        <Form.Item label="Privacy responsibility">
                          {form.getFieldDecorator('raciPrivacy', {
                            initialValue: BusinessRoleData.raciPrivacy || undefined
                          })(
                              <Radio.Group buttonStyle="solid">
                                {businessRolesEnums.raci.map(raci => <Radio.Button key={raci.value} value={raci.value || undefined}>{raci.label}</Radio.Button>)}
                              </Radio.Group>
                            )}              
                        </Form.Item> 

                      </Form>
                    </Modal>
                  );
                }}
              </Mutation>
            )}}
          </Query>
        <button className="link" onClick={this.showModal}>Edit</button>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateBusinessRole);