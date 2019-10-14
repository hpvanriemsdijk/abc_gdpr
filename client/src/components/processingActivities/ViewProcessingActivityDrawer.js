import React, {forwardRef} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Tag, List, Typography } from 'antd';
import { Error } from '../generic/viewHelpers'
import { GET_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';

const ViewProcessingActivityDrawer = forwardRef((props, ref) => {
  const { data, loading, error } = useQuery( GET_PROCESSING_ACTIVITY, { variables : { id: props.id } } );
  const dataSource = data?data.processingActivity:{}; 
  const { Text, Title } = Typography;
  let list = [];
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

  const responsibility = (imController) => {
    return imController?"Controller":"Processor"
  }

  if(dataSource.imController){
    list = [
      { lable: "Responsibility", content: responsibility(dataSource.imController) },
      { lable: "Legal grounds", content: listToTag(dataSource.legalGrounds) },
      { lable: "Legal ground comment", content: dataSource.legalGroundComment },
      { lable: "Process", content: dataSource.process?dataSource.process.name:"" },
      { lable: "Security measures", content: dataSource.securityMeasures },
      { lable: "Profiling", content: yesOrNo(dataSource.profiling) },
      { lable: "Public source", content: yesOrNo(dataSource.description) },
      { lable: "Link to DPIA", content: dataSource.linkToDpia },
      { lable: "Link to LIA", content: dataSource.linkToLia },
      { lable: "Recipients", content: listToTag(dataSource.recipients) },
      { lable: "controllers", content: listToTag(dataSource.controllers)  },
      { lable: "Data types", content: listToTag(dataSource.dataTypes)  },
    ]
  }else{
    list = [
      { lable: "Responsibility", content: responsibility(dataSource.imController) },
      { lable: "Process", content: dataSource.process?dataSource.process.name:"" },
      { lable: "Security measures", content: dataSource.securityMeasures },
      { lable: "controllers", content: listToTag(dataSource.controllers)  },
      { lable: "Processing types", content: listToTag(dataSource.procesessingTypes)  },
    ]
  }

  return(
    <div style={{ margin: 24 }}>
      <List
        header={
          <React.Fragment>  
          <Title level={4}>{dataSource.name}</Title>
          <div><Text type="secondary">{dataSource.purpose}</Text></div>
          </React.Fragment>  
        }
        dataSource={list}
        loading={loading}
        itemLayout="horizontal"
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.lable}
              description={item.content}
              />
          </List.Item>
        )}/>
      </div>
  )
})

export default ViewProcessingActivityDrawer