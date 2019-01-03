import React from 'react'
import { Query } from 'react-apollo'
import { Card } from 'antd';
import { GET_PERSON } from '../../queries/PersonQueries';

class viewPerson extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_PERSON }
          variables= {{ id: this.props.match.params.personId }}
          >

          {({ loading, data }) => {
            const dataSource = data.Person || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`Person: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewPerson