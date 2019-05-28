import React from 'react'
import { Query, Mutation, } from 'react-apollo'
import { GET_PROCESS, UPDATE_PROCESS  } from '../../queries/ProcessQueries';
import { BusinessRolessOptionsList } from '../businessRoles/BusinessRolessOptionsList'
import { OuTree } from '../organizationalUnits/OuTree'
import { Modal, Form, Input, notification, Spin } from 'antd';

class UpdateProcess extends React.Component {
  state = {
    modalVisible: false
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  // Modal
  onUpdateProcess = updateProcess => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        await updateProcess({ variables: {
          id: this.props.process.id,
          name: values.name,
          description: values.description,
          processOwner: values.processOwner || null,
          organizationalUnit: values.organizationalUnit || this.props.organizationalUnitId || undefined
        }}).catch( res => {
          notification['warning']({
            message: "Could not update Process",
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
          query = { GET_PROCESS }
          variables = {{ id: this.props.process.id }}
          skip = { !this.state.modalVisible}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error ) return null
            const ProcessData = data.Process || [];
            const processOwnerId = ProcessData.processOwner ? ProcessData.processOwner.id : null
            const organizationalUnitId = ProcessData.organizationalUnit ? ProcessData.organizationalUnit.id : null
            const loadingData = loading;
            
            return(
              <Mutation 
                mutation={UPDATE_PROCESS}
                refetchQueries={["AllProcesses", "Process"]}
                >
                {(updateProcess, { updating }) => {
                  return (
                    <Modal
                      onOk={e => this.onUpdateProcess(updateProcess)}
                      onCancel={this.closeModal}
                      title="Update process"
                      confirmLoading={updating}
                      visible={this.state.modalVisible}
                    >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form >
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: ProcessData.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                              ],
                            })(<Input />)}
                          </Form.Item>    
                          <Form.Item label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: ProcessData.description,
                              rules: [
                                { required: true, message: 'Please enter a description!' }
                              ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item>  
                          <Form.Item 
                            label="Process owner">
                            { <BusinessRolessOptionsList form={form} id={processOwnerId}/> }
                          </Form.Item>
                          <Form.Item label="Organizational Unit" >
                            <OuTree form={form} parentId={organizationalUnitId} parentTree={false} /> 
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

export default Form.create()(UpdateProcess);