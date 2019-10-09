import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Card, Tag, Row, Col } from 'antd';
import { Error } from '../generic/viewHelpers'
import UpsertProcessingActivity from './UpsertProcessingActivity'
import { GET_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';

export default function ViewProcessingActivity(props) {
  const { data, loading, error } = useQuery( GET_PROCESSING_ACTIVITY, { variables : { id: props.match.params.processingActivityId } } );
  const processingActivity = data?data.processingActivity:{};  

  if(error) return <Error />

  const yesOrNo = (state) => {
    if(state) return "Yes"
    return "No"
  }

  const listToTag = (list) => {
    if(!list || list.length < 1){return ".."}
    const tagList = list.map((d, key) => <Tag key={key}>{d.name}</Tag>);
    return tagList
  }

  console.log(processingActivity)

  return(
    <React.Fragment>  
      <Card 
        loading = {loading}
        title={ processingActivity.name } 
        extra={<UpsertProcessingActivity { ...props } activityId={processingActivity.id} type="button" />} 
        >
        <Row>
          <Col span={8}><strong>Purpose</strong></Col>
          <Col span={16}>{processingActivity.purpose}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>Controller</strong></Col>
          <Col span={16}>{yesOrNo(processingActivity.imController)}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>legalGrounds</strong></Col>
          <Col span={16}>{ listToTag(processingActivity.legalGrounds) }</Col>
        </Row>		
        <Row>
          <Col span={8}><strong>LegalGroundComment</strong></Col>
          <Col span={16}>{processingActivity.legalGroundComment}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>Process</strong></Col>
          <Col span={16}>{processingActivity.process?processingActivity.process.name:""}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>SecurityMeasures</strong></Col>
          <Col span={16}>{processingActivity.securityMeasures}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>Profiling</strong></Col>
          <Col span={16}>{yesOrNo(processingActivity.profiling)}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>PublicSource</strong></Col>
          <Col span={16}>{yesOrNo(processingActivity.description)}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>linkToDpia</strong></Col>
          <Col span={16}>{processingActivity.linkToDpia}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>linkToLia</strong></Col>
          <Col span={16}>{processingActivity.linkToLia}</Col>
        </Row>
        <Row>
          <Col span={8}><strong>recipients</strong></Col>
          <Col span={16}>{ listToTag(processingActivity.recipients) }</Col>
        </Row>
        <Row>
          <Col span={8}><strong>controllers</strong></Col>
          <Col span={16}>{ listToTag(processingActivity.controllers) }</Col>
        </Row>
        <Row>
          <Col span={8}><strong>dataTypes</strong></Col>
          <Col span={16}>{ listToTag(processingActivity.dataTypes) }</Col>
        </Row>
        <Row>
          <Col span={8}><strong>procesessingTypes</strong></Col>
          <Col span={16}>{ listToTag(processingActivity.procesessingTypes) }</Col>
        </Row>
      </Card>
    </React.Fragment>  
  )
}