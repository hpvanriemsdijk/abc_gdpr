import React, { useState } from 'react';
import { get } from 'lodash';
import { CREATE_PROCESSING_ACTIVITY, UPDATE_PROCESSING_ACTIVITY, GET_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';
import { BusinessPartnerOptionsList } from '../businessPartners/BusinessPartnerOptionsList'
import { DataTypeOptionsList } from '../dataTypes/DataTypeOptionsList'
import { ProcessingTypesOptionsList } from '../processingTypes/ProcessingTypesOptionsList'
import { LegalGroundOptionsList } from '../legalGrounds/LegalGroundOptionsList'
import { ProcessOptionsList } from '../processes/ProcessOptionsList'
import { Modal, Form, Input, Button, notification, Radio, Switch, Divider, Spin } from 'antd';
import { Loading, Error } from '../generic/viewHelpers'
import { useMutation, useQuery } from '@apollo/react-hooks';

function UpsertProcessingActivityModal(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [imController, setImController] = useState(true);
  const { form } = props;
  const rules = { required: { required: true, message: 'This is an required field.' } }
  const { TextArea } = Input;
  const activityId = props.activityId || "";
  const title = "Upsert processingActivity";

  const [createProcessingActivity] = useMutation(
    CREATE_PROCESSING_ACTIVITY, {
      refetchQueries:["ProcessingActivities"],
      onCompleted({ createProcessingActivity }) {   
        setModalVisible(false);
        form.resetFields();
      },
      onError(error){
        notification['warning']({
          message: "Could not create Processing activity",
          description: error.message,
          duration: 5
        });
      }      
    }
  );

  const [updateProcessingActivity] = useMutation(
    UPDATE_PROCESSING_ACTIVITY, {
      //onCompleted({ updateProcessingActivity }) {   
        //setModalVisible(false);
        //form.resetFields();
      //}, 
      onError(error){
        notification['warning']({
          message: "Could not create Processing activity",
          description: error.message,
          duration: 5
        });
      }    
    }
  );

  const button = () => {
    if(props.activityId){
      return(
        <button onClick={() => setModalVisible(true)} className="link">
          Edit
        </button>
      )
    }else{
      return(
        <Button onClick={() => setModalVisible(true)} type="primary">
          Add processing activity
        </Button>
      )
    }
  }

  const handleControllerChange = e => {
    setImController(e.target.value);
  };

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

  const ParentProcess = (vars) => {
    const { form, organizationalUnitId, processId  } = props;
    const { parentProcessId } = vars;

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
          { <ProcessOptionsList form={form} id={parentProcessId} /> }
        </Form.Item> 
      )
    }
  }

  //If ther is an processingActivity.id, load the activity
  const { data, loading, error } = useQuery( GET_PROCESSING_ACTIVITY, { variables : { id: activityId }, skip:!modalVisible } );
  if (error) return "...";
  const { processingActivity } = data || {};

  const onSubmit = () => {
    const { form, activityId } = props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        let parentProcess = props.processId || values.parentProcess  || null
        let connectParentProcess = process ? {process: {connect: {id: parentProcess }}} : null;
        let recipients = {}
        let controllers = {}
        let dataTypes = {}
        let procesessingTypes = {}
        let legalGrounds = {}
        let variables = { variables: {
          data: {
            name: values.name,
            purpose: values.purpose,
            imController: values.imController,
            securityMeasures: values.securityMeasures,
            legalGroundComment: values.legalGroundComment,
            profiling: values.profiling,
            publicSource: values.publicSource,
            linkToDpia: values.linkToDpia,
            linkToLia: values.linkToLia,
            ...connectParentProcess,
            ...recipients,
            ...controllers,
            ...dataTypes,
            ...procesessingTypes,
            ...legalGrounds,
          } 
        }
        };

        console.log(variables);

        if(activityId){
          variables.variables.id = activityId;
          variables.optimisticResponse = {
            updateProcessingActivity: {
              __typename: 'ProcessingActivity',
              isOptimistic: true,
              id: activityId,
              name: values.name,
              updatedAt: -10, 
              process:{
                id: parentProcess,
                name: "...",
                __typename:'Process'
              },
            },
          };
          console.log(variables);
          updateProcessingActivity(variables)
        }else{
          createProcessingActivity(variables)
        }

        //Close form
        setModalVisible(false);
        form.resetFields();        
      }
    });
  };

  return(
    <React.Fragment>
      <Modal
        onOk={e => onSubmit()}
        //confirmLoading={saving}
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        title={title}
        visible={modalVisible}
        >
        <Spin tip="Loading..." spinning={loading}>
          <Form {...formItemLayout} >
            <Form.Item label="Name">
              {form.getFieldDecorator('name', { initialValue: get(processingActivity, 'name'), rules: [ rules.required ] })(<Input />)}
            </Form.Item> 

            <Form.Item label="We are the">
              {form.getFieldDecorator('imController', {initialValue: imController } )(
                <Radio.Group buttonStyle="solid" onChange={ handleControllerChange }>                     
                  <Radio.Button value={true}>Controler</Radio.Button>
                  <Radio.Button value={false}>Processor</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item> 

            <ParentProcess parentProcessId={get(processingActivity, 'process.id')}/>

            <Form.Item label="Purpose">
              {form.getFieldDecorator('purpose', { initialValue: get(processingActivity, 'purpose'), rules: [ rules.required ] })(<TextArea />)}
            </Form.Item>                   

            {imController ? (<>
              <Form.Item label="Joined controllers">
                { <BusinessPartnerOptionsList form={form} field="controllers" id={get(processingActivity, 'controller.id')}/> }
              </Form.Item>

              <Form.Item label="Recipients">
                { <BusinessPartnerOptionsList form={form} field="recipients"/> }
              </Form.Item>

              <Form.Item label="Categories of data">
                { <DataTypeOptionsList form={form} field="dataTypes"/> }
              </Form.Item>

              <Form.Item label="Security measures">
                {form.getFieldDecorator('securityMeasures', { initialValue: get(processingActivity, 'securityMeasures') } )(<TextArea />)}
              </Form.Item> 

              <Divider orientation="left">Privacy Notices</Divider>
              
              <Form.Item label="Profiling">
                <Switch />
              </Form.Item> 

              <Form.Item label="Public source">
                <Switch />
              </Form.Item>

              <Form.Item label="Link to Pia">
                {form.getFieldDecorator('linkToDpia', { initialValue: get(processingActivity, 'linkToDpia') } )(<Input />)}
              </Form.Item> 

              <Form.Item label="Legal ground">
                {form.getFieldDecorator('legalGround', { initialValue: get(processingActivity, 'legalGround') } )(<LegalGroundOptionsList form={form} field="legalGround"/>)}
              </Form.Item>

              <Form.Item label="Legitimate interests">
                {form.getFieldDecorator('legalGroundComment', { initialValue: get(processingActivity, 'legalGroundComment') } )(<TextArea />)}
              </Form.Item>     

              <Form.Item label="link to lia">
                {form.getFieldDecorator('linkToLia', { initialValue: get(processingActivity, 'linkToLia') } )(<Input />)}
              </Form.Item> 
            </>) : (<>                    
              <Form.Item label="Controllers">
                { <BusinessPartnerOptionsList form={form} field="controllers"/> }
              </Form.Item>

              <Form.Item label="Processing types">
                { <ProcessingTypesOptionsList form={form} field="recipients"/> }
              </Form.Item> 

              <Form.Item label="Security measures">
                {form.getFieldDecorator('securityMeasures', { initialValue: get(processingActivity, 'securityMeasures') } )(<TextArea />)}
              </Form.Item> 
            </>)}                
          </Form>
        </Spin>
      </Modal>

      {button()}
    </React.Fragment>
  )
}

export default Form.create()(UpsertProcessingActivityModal);

/*
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
                      <Switch />
                    </Form.Item> 

                    <Form.Item label="Public source">
                      <Switch />
                    </Form.Item>

                    <Form.Item label="Link to Pia">
                      {form.getFieldDecorator('linkToDpia')(<Input />)}
                    </Form.Item> 

                    <Form.Item label="Legal ground">
                      {form.getFieldDecorator('legalGround')(<LegalGroundOptionsList form={form} field="legalGround"/>)}
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
          Upsert processing activity
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateProcessingActivityModal);
*/