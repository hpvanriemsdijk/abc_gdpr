import React from 'react'
import { Query } from 'react-apollo'
import { List, Typography  } from 'antd';
import { GET_OU_TYPE } from '../../queries/OUTypeQueries';
import { Loading, Error } from '../generic/viewHelpers'

class viewOUTypeDrawer extends React.Component {
  formatReportingUnit = (reportingUnit) => {
    return reportingUnit ? "Yes" : "No"
  }

  render () {   
    const { Title } = Typography;

    return (
      <Query
        query = { GET_OU_TYPE }
        variables= {{ id: this.props.id }}
        >
        {({ loading, data, error }) => {
          if(error) return <Error />
          if(loading) return <Loading />
          const dataSource = data.organizationalUnitType|| [];

          console.log(data)

          let list = [
            { lable: "Description", content: dataSource.description },
            { lable: "Reporting unit", content: this.formatReportingUnit(dataSource.reportingUnit) }
          ]

          return(
            <div style={{ margin: 24 }}>
            <List
              header={
                <React.Fragment>  
                <Title level={4}>{dataSource.name}</Title>
                </React.Fragment>  
              }
              dataSource={list}
              loading={loading}
              itemLayout="horizontal"
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.lable}
                    description={item.content}
                    />
                </List.Item>
              )}/>
            </div>
            )}}
        </Query>
      )
  }
}

export default viewOUTypeDrawer