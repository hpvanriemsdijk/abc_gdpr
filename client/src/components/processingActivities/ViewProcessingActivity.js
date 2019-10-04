import React from 'react'
import { Query } from 'react-apollo'
import { Card } from 'antd';
import { Loading, Error } from '../generic/viewHelpers'
import { GET_PROCESSING_ACTIVITY } from '../../queries/ProcessingActivitiesQueries';

class viewProcessingActivity extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_PROCESSING_ACTIVITY }
          variables= {{ id: this.props.match.params.processingActivityId }}
          >
          {({ loading, data, error }) => {
            if(error) return <Error />
            if(loading) return <Loading />
            const dataSource = data.processingActivity || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`Processing activity: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewProcessingActivity