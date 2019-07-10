import React from 'react'
import { Query } from 'react-apollo'
import { Card, Empty } from 'antd';
import { GET_DATA_TYPE } from '../../queries/DataTypeQueries';

class viewDataType extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_DATA_TYPE }
          variables= {{ id: this.props.match.params.dataTypeId }}
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.dataTypes || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`DataType: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>

                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default viewDataType