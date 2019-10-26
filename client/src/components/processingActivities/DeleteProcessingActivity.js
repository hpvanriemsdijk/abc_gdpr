import React, { useState } from 'react';
import { reject } from 'lodash';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_PROCESSING_ACTIVITY, ALL_PROCESSING_ACTIVITIES } from '../../queries/ProcessingActivitiesQueries';
import { Modal, notification } from 'antd';

export default function DeleteProcessingActivity(props) {
  const activityId = props.ProcessingActivity.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteProcessingActivity] = useMutation(
    DELETE_PROCESSING_ACTIVITY, {
      refetchQueries:["ProcessingActivities"],
      onCompleted() {   
        notification['success']({
          message: "Processing activity deleted",
          duration: 5
        });
      },
      onError(error){
        notification['warning']({
          message: "There was an issue deleteing the processing activity",
          description: error.message,
          duration: 5
        });
      }      
    }
  );

  const onDelete = () => {
    let variables = { 
      variables: {
        id: activityId
      },
      optimisticResponse: {
        deleteProcessingActivity: {
          id: activityId,
          __typename: 'ProcessingActivity'
        },
      },
      update: (proxy, { data: { deleteProcessingActivity } }) => {
        const data = proxy.readQuery({ query: ALL_PROCESSING_ACTIVITIES });
        data.processingActivities = reject(data.processingActivities, ['id', deleteProcessingActivity.id]);
        console.log(data)
        proxy.writeQuery({ query: ALL_PROCESSING_ACTIVITIES, data });
      }
    };
  
    console.log(variables)
    deleteProcessingActivity(variables)
    setModalVisible(false);
  };

  return (
    <React.Fragment>
      <Modal
        onOk={e => onDelete()}
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        title={"Are you sure you what to delete " + props.ProcessingActivity.name}
        visible={modalVisible}
      >
      <div>By deleting this activity, {props.ProcessingActivity.name} will be removed from and system, this is unrecoverable.</div>               
      </Modal>
      <button className="link" onClick={() => setModalVisible(true)}>Delete</button>  
    </React.Fragment>
  );
}