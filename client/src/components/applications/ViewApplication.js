import React from 'react'
import { Query } from 'react-apollo'
import { Card, Empty } from 'antd';
import { GET_APPLICATION } from '../../queries/ApplicationQueries';

class viewApplication extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_APPLICATION }
          variables= {{ id: this.props.match.params.applicationId }}
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.Application || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`Application: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>

                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewApplication