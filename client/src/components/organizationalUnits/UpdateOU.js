import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_OU, UPDATE_OU } from '../../queries/OUQueries';
import { Modal, Form, Input, notification, Spin } from 'antd';
import { OUTypesOptionsList } from '../organizationalUnitTypes/OUTypesOptionsList'
import { OuTree } from './OuTree'

class UpdateOU extends React.Component {
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
  onUpdateOU = updateOU => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        let parent = values.organizationalUnit ? {parent: {connect: {id: values.organizationalUnit }}} : {parent: { disconnect: true } };
        let organizationalUnitType = values.organizationalUnitType ? {organizationalUnitType: {connect: {id: values.organizationalUnitType }}} : null;

        console.log(parent)

        await updateOU({ variables: {
          id: this.props.organizationalUnit.id,
          data: {
            name: values.name, 
            description: values.description,
            ...parent,
            ...organizationalUnitType
          }
        }}).catch( res => {
          notification['warning']({
            message: "Could not update OU",
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
          query = { GET_OU }
          variables = {{ id: this.props.organizationalUnit.id }}
          skip = { !this.state.modalVisible } 
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error) return null
            const OUData = data?data.organizationalUnit:[];
            const ouTypeId = OUData.organizationalUnitType ? OUData.organizationalUnitType.id : null
            const ouParentId = OUData.parent ? OUData.parent.id : null
            const loadingData = loading;

            return(
              <Mutation 
                mutation={UPDATE_OU}
                refetchQueries={["AllOrganizationalUnits", "OrganizationalUnits"]}
                >
                {(updateOU, { loading } ) => {
                  return (
                    <Modal
                      onOk={e => this.onUpdateOU(updateOU)}
                      onCancel={this.closeModal}
                      title="Update organizational unit"
                      confirmLoading={loading}
                      visible={this.state.modalVisible}
                    >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form >
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: OUData.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                                ],
                            })(<Input />)}
                          </Form.Item>        
                          <Form.Item label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: OUData.description,
                              rules: [
                                { required: true, message: 'Please enter a description!' }
                                ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item>  
                          { <OUTypesOptionsList form={form} id={ouTypeId} /> }
                          <Form.Item 
                            label="Parent unit"
                            extra="Can't select yourself, childeren in own line or result in 3+ levels.">
                            { <OuTree form={form} parentId={ouParentId} ownKey={OUData.id} parentTree={true} /> }
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

export default Form.create()(UpdateOU);