import React from 'react'
import { Query } from 'react-apollo'
import { Card } from 'antd';
import { GET_PERSON } from '../../queries/PersonQueries';
import { Loading, Error } from '../generic/viewHelpers'

class viewPerson extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_PERSON }
          variables= {{ id: this.props.match.params.personId }}
          >
          {({ loading, data, error }) => {
            if(error) return <Error />
            if(loading) return <Loading />
            const dataSource = data.person || [];

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