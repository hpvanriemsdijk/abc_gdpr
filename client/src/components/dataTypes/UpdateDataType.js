import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_DATA_TYPE, UPDATE_DATA_TYPE } from '../../queries/DataTypeQueries';
import { Modal, Form, Input, notification, Divider, Spin, Button } from 'antd';
import { QualityAttributesFormGroup } from '../qualityAttributes/QualityAttributesFormGroup'

class UpdateDataType extends React.Component {
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
  onUpdateDataType = updateDataType => {
    const { form } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        var classificationIds = Object.keys(values.classification).map(function(key) {
          return {classificationLabelId: values.classification[key]}
        });

        await updateDataType({ variables: {
          id: this.props.dataType.id,
          name: values.name,
          description: values.description,
          classification: classificationIds
        }}).catch( res => {
          notification['warning']({
            message: "Could not update DataType",
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
          query = { GET_DATA_TYPE }
          variables = {{ id: this.props.dataType.id }}
          skip = { !this.state.modalVisible}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error ) return null
            const DataTypeData = data.DataType || [];
            const loadingData = loading;
            if (loading) return <Button onClick={this.showModal} type="link" disabled>Edit</Button>;
            
            return(
              <Mutation 
                mutation={UPDATE_DATA_TYPE}
                refetchQueries={["AllDataTypes"]}
                >
                {(updateDataType, { loading }) => {
                  return (
                    <Modal
                      onOk={e => this.onUpdateDataType(updateDataType)}
                      onCancel={this.closeModal}
                      title="Update data type"
                      confirmLoading={loading}
                      visible={this.state.modalVisible}
                      >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form {...formItemLayout} >
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: DataTypeData.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                                ],
                            })(<Input />)}
                          </Form.Item>   
                          
                          <Form.Item label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: DataTypeData.description,
                              rules: [
                                { required: true, message: 'Please enter a description!' }
                                ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item>  

                          <Divider orientation="left">Data classification</Divider>
                          <QualityAttributesFormGroup form={form} scope="DATA" classifications={DataTypeData.classification} />    
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

export default Form.create()(UpdateDataType);