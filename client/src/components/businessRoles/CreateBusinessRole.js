import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_BUSINESS_ROLE, businessRolesEnums } from '../../queries/BusinessRoleQueries';
import { Modal, Form, Input, notification, Radio } from 'antd';
import { PersonsOptionsList } from '../persons/PersonsOptionsList'


class CreateBusinessRoleModal extends React.Component {
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
  onCreateBusinessRole = createBusinessRole => {
    const { form } = this.props;
    
    form.validateFields(async (err, values) => {
      if (!err) {
        let person = values.person ? {person: {connect: {id: values.person }}} : null;

        await createBusinessRole({ variables: {
          data: {
            name: values.name, 
            description: values.description,
            ...person,
            organizationalUnit: {connect: {id: this.props.organizationalUnit }},
            raciExecutive: values.raciExecutive || null,
            raciFinancial: values.raciFinancial || null,
            raciSecurity: values.raciSecurity || null,
            raciPrivacy: values.raciPrivacy || null
          }
        }}).catch( res => {
          notification['warning']({
            message: "Could not create business role",
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
          mutation={CREATE_BUSINESS_ROLE}
          refetchQueries={["BusinessRoles"]}
          >
          
          {(createBusinessRole, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreateBusinessRole(createBusinessRole)}
                destroyOnClose={true}
                onCancel={this.closeModal}
                title="Create Business role"
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

                  <Form.Item 
                      label="Person">
                      { <PersonsOptionsList form={form} /> }
                  </Form.Item>

                  <Form.Item label="Description">
                    {form.getFieldDecorator('description', {
                      rules: [
                        { required: true, message: 'Please enter a description!' }
                      ],
                    })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                  </Form.Item>

                  <Form.Item label="Executive responsibility">
                    {form.getFieldDecorator('raciExecutive', {initialValue: undefined})(
                        <Radio.Group buttonStyle="solid">
                           {businessRolesEnums.raci.map(raci => <Radio.Button key={raci.value} value={raci.value || undefined}>{raci.label}</Radio.Button>)}
                        </Radio.Group>
                      )}              
                  </Form.Item>

                  <Form.Item label="Financial responsibility">
                    {form.getFieldDecorator('raciFinancial', {initialValue: undefined})(
                        <Radio.Group buttonStyle="solid">
                           {businessRolesEnums.raci.map(raci => <Radio.Button key={raci.value} value={raci.value || undefined}>{raci.label}</Radio.Button>)}
                        </Radio.Group>
                      )}              
                  </Form.Item>

                  <Form.Item label="Security responsibility">
                    {form.getFieldDecorator('raciSecurity', {initialValue: undefined})(
                        <Radio.Group buttonStyle="solid">
                           {businessRolesEnums.raci.map(raci => <Radio.Button key={raci.value} value={raci.value || undefined}>{raci.label}</Radio.Button>)}
                        </Radio.Group>
                      )}              
                  </Form.Item>

                  <Form.Item label="Privacy responsibility">
                    {form.getFieldDecorator('raciPrivacy', {initialValue: undefined})(
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
        <button className="link" onClick={this.showModal}>
          Add
        </button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateBusinessRoleModal);