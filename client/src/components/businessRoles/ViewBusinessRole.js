import React from 'react'
import { Query } from 'react-apollo'
import { Card, Empty } from 'antd';
import { GET_BUSINESS_ROLE } from '../../queries/BusinessRoleQueries';

class viewBusinessRole extends React.Component {
  render () {  
    return (
        <Query
          query = { GET_BUSINESS_ROLE }
          variables= {{ id: this.props.id || this.props.match.params.businessRoleId }}
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.BusinessRole || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`BusinessRole: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewBusinessRole