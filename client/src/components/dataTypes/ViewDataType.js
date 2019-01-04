import React from 'react'
import { Query } from 'react-apollo'
import { Card } from 'antd';
import { GET_DATA_TYPE } from '../../queries/DataTypeQueries';

class viewDataType extends React.Component {
  render () {   
    return (
        <Query
          query = { GET_DATA_TYPE }
          variables= {{ id: this.props.match.params.dataTypeId }}
          >

          {({ loading, data }) => {
            const dataSource = data.DataType || [];

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