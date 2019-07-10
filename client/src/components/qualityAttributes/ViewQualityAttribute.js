import React from 'react'
import { Query } from 'react-apollo'
import { Card, Empty, List, Typography } from 'antd';
import { GET_QUALITY_ATTRIBUTE } from '../../queries/QualityAttributeQueries';

class viewQualityAttributeDrawer extends React.Component {
  render () {   
    const { Title } = Typography;

    return (
      <Query
        query = { GET_QUALITY_ATTRIBUTE }
        variables= {{ id: this.props.id }}
        >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          if(loading) return <Card><Empty>loading..</Empty></Card>
          const qualityAttribute = data.qualityAttribute;

          let list = [
            { lable: "Description", content: qualityAttribute.description },
            { lable: "Applies To", content: qualityAttribute.appliesToObject }
          ]

          let labelList = qualityAttribute.classificationLabels.map((label) => {
            return ({ 
              lable: "Classification label: " + label.label + " (Rating : " + label.score + ")", 
              content: label.criteria })
          })

          list = [...list, ...labelList]

          return(
            <div style={{ margin: 24 }}>
                <List
                  header={
                    <React.Fragment>  
                    <Title level={4}>{qualityAttribute.name}</Title>
                    </React.Fragment>  
                  }
                  dataSource={list}
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
            )}}
        </Query>
      )
  }
}

export default viewQualityAttributeDrawer