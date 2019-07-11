import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { UPDATE_QUALITY_ATTRIBUTE, GET_QUALITY_ATTRIBUTE, qualityAttributeEnums } from '../../queries/QualityAttributeQueries';
import { Modal, Form, Input, Button, notification, Select, Spin } from 'antd';
import ClassificationLabels from './ClassificationLabelsFormElement';

class UpdateQualityAttributeModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalVisible: false,
      dataSource: null
    };
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  // Modal
  onCreateQualityAttribute = createQualityAttribute => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        let updateLabels = this.state.dataSource.map(updateLabel => {
          return {
            where: {id: updateLabel.id},
            data: {
              criteria: updateLabel.criteria,
              label: updateLabel.label,
              score: updateLabel.score,
            }
          }
        })

        await createQualityAttribute({ variables: {
          id: this.props.qualityAttribute.id,
          data: {
            name: values.name, 
            description: values.description,
            appliesToObject: values.appliesToObject,
            classificationLabels: {
              update: updateLabels
            } 
          }
        }}).catch( res => {
          notification['warning']({
            message: "Could not create QualityAttribute",
            description: res.message,
            duration: 5
          });
        });
        this.closeModal();
        form.resetFields();
      }
    });
  };

  passLabels = (lables) => {
    this.setState({ dataSource: lables });
  }
    
  sanitizeClassificationLabels = (classificationLabels) => {
    let sanitized = classificationLabels.map(classificationLabel => {
      return ({
        id: classificationLabel.id,
        score: classificationLabel.score,
        label: classificationLabel.label,
        criteria: classificationLabel.criteria,
      })
    })

    return sanitized
  }


  render() {
    const { form } = this.props;
    const { TextArea } = Input;

    return (
      <React.Fragment>
        <Query
          query = { GET_QUALITY_ATTRIBUTE }
          variables = {{ id: this.props.qualityAttribute.id }}
          skip = { !this.state.modalVisible }
          onCompleted = {data => this.setState({ dataSource: this.sanitizeClassificationLabels(data.qualityAttribute.classificationLabels) })}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error) return null
            const loadingData = loading;
            const QualityAttributeData = data.qualityAttribute || [];

            return(
              <Mutation 
                mutation={UPDATE_QUALITY_ATTRIBUTE}
                refetchQueries={["QualityAttributes", "QualityAttribute"]}
                >
                {(createQualityAttribute, { loading }) => {
                  return (
                    <Modal
                      onOk={e => this.onCreateQualityAttribute(createQualityAttribute)}
                      onCancel={this.closeModal}
                      width={800}
                      title="Update Quality attribute"
                      confirmLoading={loading}
                      visible={this.state.modalVisible}
                      >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form layout="horizontal">
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: QualityAttributeData.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                              ],
                            })(<Input />)}
                          </Form.Item>                            
                          <Form.Item 
                            label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: QualityAttributeData.description,
                              rules: [
                                { required: true, message: 'Please enter a description!' }
                              ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item>
                          <Form.Item label="Classification object">
                            {form.getFieldDecorator('appliesToObject', {
                              initialValue: QualityAttributeData.appliesToObject,
                              rules: [{ required: true, message: 'Select a object!' }]
                            })(
                              <Select
                                style={{ width: '100%' }}
                                allowClear={true}
                                placeholder="Select a object"
                              >
                                {qualityAttributeEnums.objects.map(object => <Select.Option key={object.value} value={object.value || undefined}>{object.label}</Select.Option>)}
                              </Select>
                              
                              )}              
                          </Form.Item>                  
                          <Form.Item label="Classification labels">
                            <ClassificationLabels dataSource={this.state.dataSource} passLabels={this.passLabels} />
                          </Form.Item>
                        </Form>
                      </Spin>
                    </Modal>
                  );
                }}
              </Mutation>
          )}}
        </Query>
        <Button onClick={this.showModal} type="link">
          Edit
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(UpdateQualityAttributeModal);