import React from 'react'
import { Query } from 'react-apollo'
import { Card } from 'antd';
import { GET_PROCESS } from '../../queries/ProcessQueries';

class viewProcess extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_PROCESS }
          variables= {{ id: this.props.match.params.processId }}
          >

          {({ loading, data }) => {
            const dataSource = data.Process || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`Process: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewProcess