import React, { useState } from 'react';
import { get } from 'lodash';
import { CREATE_PROCESSING_ACTIVITY, UPDATE_PROCESSING_ACTIVITY, GET_PROCESSING_ACTIVITY, ALL_PROCESSING_ACTIVITIES } from '../../queries/ProcessingActivitiesQueries';
import { BusinessPartnerOptionsList } from '../businessPartners/BusinessPartnerOptionsList'
import { DataTypeOptionsList } from '../dataTypes/DataTypeOptionsList'
import { ProcessingTypesOptionsList } from '../processingTypes/ProcessingTypesOptionsList'
import { LegalGroundOptionsList } from '../legalGrounds/LegalGroundOptionsList'
import { ProcessOptionsList } from '../processes/ProcessOptionsList'
import { Modal, Form, Input, Button, notification, Radio, Switch, Divider, Spin } from 'antd';
import { useMutation, useQuery } from '@apollo/react-hooks';

function UpsertProcessingActivityModal(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [imController, setImController] = useState(true);
  const rules = { required: { required: true, message: 'This is an required field.' } }
  const { TextArea } = Input;
  const { form } = props;
  let { activityId } = props;
  const title = "Upsert processingActivity";
  const { data, loading, error } = useQuery( GET_PROCESSING_ACTIVITY, { variables : { id: activityId }, skip:!modalVisible||!activityId } );
  const processingActivity = data?data.processingActivity:{};  

  const [createProcessingActivity] = useMutation(
    CREATE_PROCESSING_ACTIVITY, {
      refetchQueries:["ProcessingActivities"],
      onCompleted() {   
        notification['success']({
          message: "Processing activity updated",
          duration: 5
        });
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
      onCompleted() {   
        notification['success']({
          message: "Processing activity added",
          duration: 5
        });
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

  const connectRelation = (relation, name) => {
    if(!relation) return null;
    let idArray = relation.map(id =>{return {id: id }})
    return idArray.length ? { [name]: {connect: idArray}} : null;
  }

  const onSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err) {
        let parentProcess = props.processId || values.parentProcess  || null
        let connectParentProcess = process ? {process: {connect: {id: parentProcess }}} : null;
        let recipients = connectRelation(values.recipients, 'recipients');
        let controllers = connectRelation(values.controllers, 'controllers');
        let dataTypes = connectRelation(values.dataTypes, 'dataTypes');
        let procesessingTypes = connectRelation(values.procesessingTypes, 'procesessingTypes');
        let legalGrounds = connectRelation(values.legalGrounds, 'legalGrounds');
        let optimisticFunction = "updateProcessingActivity";

        if(!activityId){
          //Creating
          activityId = Math.round(Math.random() * -1000000);
          optimisticFunction = "createProcessingActivity"
        }

        let variables = { 
          variables: {
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
              ...legalGrounds
            } 
          },
          optimisticResponse: {
            [ optimisticFunction ]: {
              __typename: 'ProcessingActivity',
              id: activityId,
              name: values.name,
              updatedAt: -10, 
              imController: values.imController,
              purpose: values.purpose,
              process:{
                id: parentProcess,
                name: "...",
                __typename:'Process'
              },
            },
          }          
        };

        if(optimisticFunction === "createProcessingActivity"){
          variables.update = (proxy, { data: { createProcessingActivity } }) => {
            const data = proxy.readQuery({ query: ALL_PROCESSING_ACTIVITIES });
            data.processingActivities.push( createProcessingActivity );
            proxy.writeQuery({ query: ALL_PROCESSING_ACTIVITIES, data });
          }          
          createProcessingActivity(variables)
        }else{
          variables.variables.id = activityId;
          updateProcessingActivity(variables)
        }

        //Close form
        setModalVisible(false);
        form.resetFields();        
      }
    });
  };

  if (error) return "...";

  return(
    <React.Fragment>
      <Modal
        onOk={e => onSubmit()}
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
                { <BusinessPartnerOptionsList form={form} field="controllers" initialValue={processingActivity.controllers} /> }
              </Form.Item>

              <Form.Item label="Recipients">
                { <BusinessPartnerOptionsList form={form} field="recipients" initialValue={processingActivity.recipients}/> }
              </Form.Item>

              <Form.Item label="Categories of data">
                { <DataTypeOptionsList form={form} field="dataTypes" initialValue={processingActivity.dataTypes}/> }
              </Form.Item>

              <Form.Item label="Security measures">
                {form.getFieldDecorator('securityMeasures', { initialValue: get(processingActivity, 'securityMeasures') } )(<TextArea />)}
              </Form.Item> 

              <Divider orientation="left">Privacy Notices</Divider>
              
              <Form.Item label="Profiling">
                {form.getFieldDecorator('profiling', { valuePropName: 'checked', initialValue: get(processingActivity, 'profiling') })(<Switch />)}
              </Form.Item> 

              <Form.Item label="Public source">
                {form.getFieldDecorator('publicSource', { valuePropName: 'checked', initialValue: get(processingActivity, 'publicSource') })(<Switch />)}
              </Form.Item>

              <Form.Item label="Link to Pia">
                {form.getFieldDecorator('linkToDpia', { initialValue: get(processingActivity, 'linkToDpia') } )(<Input />)}
              </Form.Item> 

              <Form.Item label="Legal ground">
                { <LegalGroundOptionsList form={form} field="legalGrounds" initialValue={processingActivity.legalGrounds}  /> }
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
                {form.getFieldDecorator('procesessingTypes', { initialValue: get(processingActivity, 'procesessingTypes') } )(<ProcessingTypesOptionsList form={form} field="procesessingTypes"/>)}
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