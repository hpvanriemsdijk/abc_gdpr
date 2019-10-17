import React, { useState } from 'react';
import { get, lowerFirst, upperFirst } from 'lodash';
import { Modal, Form, Input, Button, notification, Spin } from 'antd';
import { useMutation, useQuery } from '@apollo/react-hooks';

/* 
 * Component for creating generic types 
 * supporting the fields: id, name, description, updatedAt, createdAt
 *
 * input: typeName, typeLabel, typeId, allQuery, getQuery, createQuery, updateQuery
 */

function GenericUpsertModal(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const rules = { required: { required: true, message: 'This is an required field.' } }
  const { TextArea } = Input;
  const { form, typeName, typeLabel, allQuery, getQuery, createQuery, updateQuery } = props;
  let { typeId } = props;
  let title = "Update " + typeLabel;
  const { data, loading, error } = useQuery( getQuery, { variables : { id: typeId }, skip:!modalVisible||!typeId } );
  const typeData = data?data[typeName]:{};  
  const createAction = typeId?false:true;
  let optimisticFunction = "update" + typeName;

  const [createType] = useMutation(
    createQuery, {
      refetchQueries:[ typeName, typeName+"s" ],
      onCompleted() {   
        notification['success']({
          message: typeLabel + " created",
          duration: 5
        });
      },
      onError(error){
        notification['warning']({
          message: "Could not create " + typeLabel,
          description: error.message,
          duration: 5
        });
      }      
    }
  );

  const [updateType] = useMutation(
    updateQuery, {
      onCompleted() {   
        notification['success']({
          message: typeLabel + " updated",
          duration: 5
        });
      }, 
      onError(error){
        notification['warning']({
            message: "Could not update " + typeLabel,
          description: error.message,
          duration: 5
        });
      }    
    }
  );

  const button = () => {
    if(!createAction){
      return(
        <button onClick={() => setModalVisible(true)} className="link">
          Edit
        </button>
      )
    }else{
      return(
        <Button onClick={() => setModalVisible(true)} type="primary">
          Add {typeLabel}
        </Button>
      )
    }
  }

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

  const onSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err) {
        if(createAction){
          typeId = Math.round(Math.random() * -1000000);
          optimisticFunction = "create" + typeName;
          title = "Create " + typeLabel;
        }

        let variables = { 
          variables: {
            data: {
              name: values.name,
              description: values.description,
            } 
          },
          optimisticResponse: {
            [ optimisticFunction ]: {
              __typename: typeName,
              id: typeId,
              name: values.name,
              description: values.description,
              updatedAt: -10, 
            },
          }          
        };

        if(createAction){
            variables.update = (proxy, { data: { createQuery } }) => {
                try {
                    const data = proxy.readQuery({ query: allQuery });
                    data[typeName].push( createQuery );
                    proxy.writeQuery({ query: allQuery, data });
                } catch (err) {
                    console.log( typeName + " not in store")
                }
            }          
            createType(variables)
        }else{
            variables.variables.id = typeId;
            updateType(variables)
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
              {form.getFieldDecorator('name', { initialValue: get(typeData, 'name'), rules: [ rules.required ] })(<Input />)}
            </Form.Item> 

            <Form.Item label="Description">
                {form.getFieldDecorator('description', { initialValue: get(typeData, 'description') } )(<TextArea />)}
            </Form.Item>              
          </Form>
        </Spin>
      </Modal>

      {button()}
    </React.Fragment>
  )
}

export default Form.create()(GenericUpsertModal);