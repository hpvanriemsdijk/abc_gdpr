import React from 'react'
import { Query } from 'react-apollo'
import { Card, Empty, Tag, List, Typography  } from 'antd';
import { GET_APPLICATION } from '../../queries/ApplicationQueries';

class viewApplicationDrawer extends React.Component {
  arrayToText = (aliases) =>{
    if(aliases){
      return(
        [aliases.slice(0, -1).join(', '), aliases.slice(-1)[0]].join(aliases.length < 2 ? '' : ' and ')
      )
    }
  }

  datatypesToTags = (aliases) =>{
    if(aliases){
      return(
        aliases.map((alias) => 
          <Tag key={alias.id}>{alias.name}</Tag>
        )
      )
    }
  }

  formatRole = (role) => {
    let returnValue = "-"

    if(role){
      returnValue = role.name
    }

    if(role && role.person){
      returnValue += " (" + role.person.surname + " " + role.person.name + ")"
    }

    return returnValue
  }

  render () {   
    const { Text,Title } = Typography;

    return (
      <Query
        query = { GET_APPLICATION }
        variables= {{ id: this.props.id }}
        >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const dataSource = data.application || [];

          let list = [
            { lable: "Description", content: dataSource.description },
            { lable: "Data types", content: this.datatypesToTags(dataSource.dataTypes) },
            { lable: "Business owner", content: this.formatRole(dataSource.businessOwner)},
            { lable: "IT owner", content: this.formatRole(dataSource.itOwner) },
            { lable: "Security administrator", content: this.formatRole(dataSource.securityAdministrator) },
          ]

          return(
            <div style={{ margin: 24 }}>
            <List
              header={
                <React.Fragment>  
                <Title level={4}>{dataSource.name}</Title>
                <div><Text type="secondary">Aliases: {this.arrayToText(dataSource.alias)}</Text></div>
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
            )}}
        </Query>
      )
  }
}

export default viewApplicationDrawer