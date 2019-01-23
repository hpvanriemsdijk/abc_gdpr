import React from 'react'
import { Query } from 'react-apollo'
import { Card, Empty } from 'antd';
import { GET_OU } from '../../queries/OUQueries';

class viewOU extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_OU }
          variables= {{ id: this.props.match.params.ouId }}
          >

          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.OrganizationalUnit || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`Organizational unit: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewOU