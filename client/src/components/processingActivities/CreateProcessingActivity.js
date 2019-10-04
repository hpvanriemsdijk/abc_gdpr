import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';
import { BusinessPartnerOptionsList } from '../businessPartners/BusinessPartnerOptionsList'
import { DataTypeOptionsList } from '../dataTypes/DataTypeOptionsList'
import { ProcessingTypesOptionsList } from '../processingTypes/ProcessingTypesOptionsList'
import { LegalGroundOptionsList } from '../legalGrounds/LegalGroundOptionsList'
import { ProcessOptionsList } from '../processes/ProcessOptionsList'

import { Modal, Form, Input, Button, notification, Radio, Switch, Divider } from 'antd';

class CreateProcessingActivityModal extends React.Component {
  state = {
    modalVisible: false, 
    imController: true
  };

   showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  // Modal
  onCreateProcessingActivity = createProcessingActivity => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        let parentProcess = this.props.processId || values.parentProcess  || null
        parentProcess = process ? {process: {connect: {id: parentProcess }}} : null;

        await createProcessingActivity({ variables: {
          data: {
            name: values.name,
            description: values.description,
            purpose: values.purpose,
            ...parentProcess
          } 
        }}).catch( res => {
          notification['warning']({
            message: "Could not create Processing activity",
            description: res.message,
            duration: 5
          });
        });
        this.closeModal();
        form.resetFields();
      }
    });
  };

  handleControllerChange = e => {
    this.setState({ imController: e.target.value });
  };

  parentProcess = () => {
    const { form, organizationalUnitId, processId } = this.props;

    console.log(organizationalUnitId, processId);

    if(processId){
      //Process is given and can't be selected
      return null
    }else if(organizationalUnitId){
      //OU by parent call, only show processes fron this OU
      return(
        <Form.Item 
          extra="Only processes from the selected OU are shown."
          label="Process">
          { <ProcessOptionsList form={form} organizationalUnitId={organizationalUnitId} /> }
        </Form.Item> 
      )
    }else{
      //Give them all
      return(
        <Form.Item label="Process">
          { <ProcessOptionsList form={form} /> }
        </Form.Item> 
      )
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

    const rules = {
      required: { required: true, message: 'This is an required field.' }
    }

    return (
      <React.Fragment>
        <Mutation 
          mutation={CREATE_PROCESSING_ACTIVITY}
          refetchQueries={["ProcessingActivities"]}
          >
          {(createProcessingActivity, { loading }) => {
            return (
              <Modal
                onOk={e => this.onCreateProcessingActivity(createProcessingActivity)}
                destroyOnClose={true}
                onCancel={this.closeModal}
                title="Create processing activity"
                confirmLoading={loading}
                visible={this.state.modalVisible}
              >
                <Form {...formItemLayout} >
                  <Form.Item label="Name">
                    {form.getFieldDecorator('name', { rules: [ rules.required ] })(<Input />)}
                  </Form.Item> 

                  <Form.Item label="We are the">
                    {form.getFieldDecorator('imController', {initialValue: this.state.imController } )(
                      <Radio.Group buttonStyle="solid" onChange={ this.handleControllerChange }>                     
                        <Radio.Button value={true}>Controler</Radio.Button>
                        <Radio.Button value={false}>Processor</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item> 

                  {this.parentProcess()}

                  <Form.Item label="Purpose">
                    {form.getFieldDecorator('purpose', { rules: [ rules.required ] })(<TextArea />)}
                  </Form.Item>                   

                  {this.state.imController ? (<>
                    <Form.Item label="Joined controllers">
                      { <BusinessPartnerOptionsList form={form} field="controllers"/> }
                    </Form.Item>

                    <Form.Item label="Recipients">
                      { <BusinessPartnerOptionsList form={form} field="recipients"/> }
                    </Form.Item>

                    <Form.Item label="Categories of data">
                      { <DataTypeOptionsList form={form} field="dataTypes"/> }
                    </Form.Item>

                    <Form.Item label="Security measures">
                      {form.getFieldDecorator('securityMeasures')(<TextArea />)}
                    </Form.Item> 

                    <Divider orientation="left">Privacy Notices</Divider>
                    
                    <Form.Item label="Profiling">
                      {form.getFieldDecorator('profiling')(<Switch />)}
                    </Form.Item> 

                    <Form.Item label="Public source">
                      {form.getFieldDecorator('publicSource')(<Switch />)}
                    </Form.Item> 

                    <Form.Item label="Link to Pia">
                      {form.getFieldDecorator('linkToDpia')(<Input />)}
                    </Form.Item> 

                    <Form.Item label="Legal ground">
                      {form.getFieldDecorator('legalGround', { initialValue: undefined, rules: [ rules.required ] })(<LegalGroundOptionsList form={form} field="legalGround"/>)}
                    </Form.Item>

                    <Form.Item label="Legitimate interests">
                      {form.getFieldDecorator('legalGroundComment')(<TextArea />)}
                    </Form.Item>     

                    <Form.Item label="link to lia">
                      {form.getFieldDecorator('linkToLia')(<Input />)}
                    </Form.Item> 
                  </>) : (<>                    
                    <Form.Item label="Controllers">
                      { <BusinessPartnerOptionsList form={form} field="controllers"/> }
                    </Form.Item>

                    <Form.Item label="Processing types">
                      { <ProcessingTypesOptionsList form={form} field="recipients"/> }
                    </Form.Item> 

                    <Form.Item label="Security measures">
                      {form.getFieldDecorator('securityMeasures')(<TextArea />)}
                    </Form.Item> 
                  </>)}                
                </Form>
              </Modal>
            );
          }}
        </Mutation>
        <Button onClick={this.showModal} type="primary">
          New processing activity
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateProcessingActivityModal);