import React from 'react'
import idx from 'idx'
import { Query } from 'react-apollo'
import { Card, Empty, List, Typography  } from 'antd';
import { GET_BUSINESSPARTNER } from '../../queries/BusinessPartnerQueries';

class viewBusinessPartnerDrawer extends React.Component {
  render () {   
    const { Title } = Typography;

    return (
      <Query
        query = { GET_BUSINESSPARTNER }
        variables= {{ id: this.props.id }}
        >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const dataSource = data.businessPartner|| {headOffice:{}};

          console.log(data)

          let list = [
            { lable: "Description", content: dataSource.description },
            { lable: "Contact details", content: dataSource.contactDetails },
            { lable: "Representative", content: dataSource.representative },
            { lable: "DPO", content: dataSource.dpo },
            { lable: "Office name", content: idx(dataSource, (_) => _.headOffice.name) },
            { lable: "Office description", content: idx(dataSource, (_) => _.headOffice.description) },
            { lable: "Office Address", content: idx(dataSource, (_) => _.headOffice.address) }
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

export default viewBusinessPartnerDrawer