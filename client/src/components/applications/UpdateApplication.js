import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_APPLICATION, UPDATE_APPLICATION } from '../../queries/ApplicationQueries';
import { Modal, Form, Input, notification, Select, Spin } from 'antd';
import { BusinessRolesOptionsList } from '../businessRoles/BusinessRolesOptionsList'
import { DataTypeOptionsList } from '../dataTypes/DataTypeOptionsList'

class UpdateApplication extends React.Component {
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
  onUpdateApplication = updateApplication => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        let dataTypesArray = values.dataTypes.map(dataType =>{return {id: dataType }})
        let dataTypes = values.dataTypes.length ? {dataTypes: {connect: dataTypesArray }} : null;
        let businessOwner = values.businessOwner ? {businessOwner: {connect: {id: values.businessOwner }}} : null;
        let itOwner = values.itOwner ? {itOwner: {connect: {id: values.itOwner }}} : null;
        let securityAdministrator = values.securityAdministrator ? {securityAdministrator: {connect: {id: values.securityAdministrator }}} : null;

        await updateApplication({ variables: {
          id: this.props.application.id, 
          data: {
            name: values.name, 
            description: values.description,
            alias: values.alias,
            ...dataTypes,
            ...businessOwner,
            ...itOwner,
            ...securityAdministrator
          }          
        }}).catch( res => {
          notification['warning']({
            message: "Could not update Application",
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
          query = { GET_APPLICATION }
          variables = {{ id: this.props.application.id }}
          skip = { !this.state.modalVisible}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error) return null
            const ApplicationData = data?data.application:[];
            const businessOwnerId = ApplicationData.businessOwner ? ApplicationData.businessOwner.id : null
            const itOwnerId = ApplicationData.itOwner ? ApplicationData.itOwner.id : null
            const securityAdministratorId = ApplicationData.securityAdministrator ? ApplicationData.securityAdministrator.id : null
            const loadingData = loading;

            return(
            <Mutation 
              mutation={UPDATE_APPLICATION}
              refetchQueries={["Applications"]}
              >
              {(updateApplication, { loading }) => {
                return (
                  <Modal
                    onOk={e => this.onUpdateApplication(updateApplication)}
                    onCancel={this.closeModal}
                    title="Update Application"
                    confirmLoading={loading}
                    visible={this.state.modalVisible}
                  >
                  <Spin tip="Loading..." spinning={loadingData}>
                    <Form >
                      <Form.Item label="Name">
                        {form.getFieldDecorator('name', {
                          initialValue: ApplicationData.name,
                          rules: [
                            { required: true, message: 'Please enter a name!' }
                            ],
                        })(<Input />)}
                      </Form.Item>       

                      <Form.Item 
                        label="Alias"
                        extra="Seperate alisasses with the , character.">
                        {form.getFieldDecorator('alias',{
                          initialValue: ApplicationData.alias})(
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            tokenSeparators={[',']}
                          ></Select>
                          )}
                      </Form.Item>                  
                      
                      <Form.Item label="Description">
                        {form.getFieldDecorator('description', {
                          initialValue: ApplicationData.description,
                          rules: [
                            { required: true, message: 'Please enter a description!' }
                            ],
                        })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                      </Form.Item>  
                      
                        <Form.Item label="Data">
                        { <DataTypeOptionsList form={form} initialValue={ApplicationData.dataTypes} /> }
                        </Form.Item>

                        <Form.Item label="Business Owner">
                          { <BusinessRolesOptionsList form={form} field="businessOwner" id={businessOwnerId}/> }
                        </Form.Item>

                        <Form.Item label="IT Owner">
                          { <BusinessRolesOptionsList form={form} field="itOwner" id={itOwnerId}/> }
                        </Form.Item>

                        <Form.Item label="Security Administrator">
                          { <BusinessRolesOptionsList form={form} field="securityAdministrator" id={securityAdministratorId}/> }
                        </Form.Item>

                    </Form>
                    </Spin>
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

export default Form.create()(UpdateApplication);