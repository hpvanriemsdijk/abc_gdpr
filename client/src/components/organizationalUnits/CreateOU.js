import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_OU } from '../../queries/OUQueries';
import { Modal, Form, Input, Button, notification } from 'antd';
import { OUTypesOptionsList } from '../organizationalUnitTypes/OUTypesOptionsList'
import { OuTree } from '../organizationalUnits/OuTree'
import { LocationOptionsList } from '../locations/LocationOptionsList'

class CreateOUModal extends React.Component {
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
  onCreateOU = createOU => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {       
        let parent = values.organizationalUnit ? {parent: {connect: {id: values.organizationalUnit }}} : null;
        let organizationalUnitType = values.organizationalUnitType ? {organizationalUnitType: {connect: {id: values.organizationalUnitType }}} : null;

        await createOU({ variables: {
          data: {
            name: values.name, 
            description: values.description,
            ...parent,
            ...organizationalUnitType
          }
        }}).catch( res => {
          notification['warning']({
            message: "Could not create Organisational Unit",
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
        <Mutation 
          mutation={CREATE_OU}
          refetchQueries={["AllOrganizationalUnits"]}
          >
          {(createOU, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreateOU(createOU)}
                onCancel={this.closeModal}
                destroyOnClose={true}
                title="Create Organizational Unit"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form layout="horizontal">
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', {
                      rules: [
                        { required: true, message: 'Please enter a name!' }
                      ],
                    })(<Input />)}
                  </Form.Item>                        
                  <Form.Item label="Description">
                    {form.getFieldDecorator('description', {
                      rules: [
                        { required: true, message: 'Please enter a description!' }
                      ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>
                  <OUTypesOptionsList form={form} />
                  <Form.Item 
                    label="Parent unit"
                    extra="Can't select yourself, childeren in own line or result in 3+ levels.">
                    { <OuTree form={form} parentTree={true} /> }
                  </Form.Item>
                  <LocationOptionsList 
                    form={form} 
                    relationName="headOffice" 
                    label="Head Office" />  
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary" icon="plus-circle">
          New Organizational Unit
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateOUModal);