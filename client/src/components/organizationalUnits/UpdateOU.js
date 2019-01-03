import React from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_OU } from '../../queries/OUQueries';
import { Modal, Form, Input, notification, Checkbox } from 'antd';

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
        await updateOU({ variables: {
          id: this.props.organizationalUnit.id,
          name: values.name,
          description: values.description,
          legalEntity: values.legalEntity
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
    const OUData = this.props.organizationalUnit

    return (
      <React.Fragment>
        <Mutation 
          mutation={UPDATE_OU}
          refetchQueries={["AllOrganizationalUnits"]}
          >
          {(updateOU, { loading, error, data }) => {
            return (
              <Modal
                onOk={e => this.onUpdateOU(updateOU)}
                onCancel={this.closeModal}
                title="Update organizational unit"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
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

                  <Form.Item label="Legal entity">
                    {form.getFieldDecorator('legalEntity', {
                      valuePropName: "checked",
                      initialValue : OUData.legalEntity
                    })(<Checkbox />)}
                  </Form.Item>  

                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <a onClick={this.showModal}>Edit</a>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateOU);