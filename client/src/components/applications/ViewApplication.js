import React from 'react'
import { Query } from 'react-apollo'
import { Card, Empty, Descriptions, Row } from 'antd';
import { GET_APPLICATION } from '../../queries/ApplicationQueries';

class viewApplicationDrawer extends React.Component {
  arrayToText = (aliases) =>{
    if(aliases){
      return(
        [aliases.slice(0, -1).join(', '), aliases.slice(-1)[0]].join(aliases.length < 2 ? '' : ' and ')
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
    return (
        <Query
          query = { GET_APPLICATION }
          variables= {{ id: this.props.id }}
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.Application || [];
            console.log(dataSource)

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  style={{ background: '#fff' }}>
                  <Card.Meta 
                    title={ dataSource.name } 
                    description={ "Aliases: " + this.arrayToText(dataSource.alias) } />              
                </Card>
                <div style={{ margin: 24 }}>
                  <Descriptions title="Application">
                    <Descriptions.Item label="Descriptions">{ dataSource.description }</Descriptions.Item>
                    <Descriptions.Item label="Data types">{ this.arrayToText(dataSource.dataType) }</Descriptions.Item>
                  </Descriptions>
                  <Descriptions title="Roles">
                    <Descriptions.Item label="Business owner">{ this.formatRole(dataSource.businessOwner) }</Descriptions.Item>
                    <Descriptions.Item label="IT owner">{ this.formatRole(dataSource.businessOwner) }</Descriptions.Item>
                    <Descriptions.Item label="Security administrator">{ this.formatRole(dataSource.businessOwner) }</Descriptions.Item>
                  </Descriptions>
                </div>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewApplicationDrawer