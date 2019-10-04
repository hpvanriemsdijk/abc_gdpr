import React from 'react'
import { Query } from 'react-apollo'
import { Table, Divider, Card } from 'antd';
import { ALL_BUSINESSPARTNERS  } from '../../queries/BusinessPartnerQueries';
import CreateBusinessPartner from './CreateBusinessPartner'
import UpdateBusinessPartner from './UpdateBusinessPartner'
import DeleteBusinessPartner from './DeleteBusinessPartner'
import viewBusinessPartnerDrawer from './ViewBusinessPartner'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { ShowInDrawer, Error } from '../generic/viewHelpers'

class BusinessPartnersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedInfo: null, 
      filteredInfo: null
    };
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  handleSearch = (confirm) => {
    confirm();
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ filteredInfo: null });
  }

  render () {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [{
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name)},
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      ...clientSideFilter('name', this.searchInput, this.handleSearch, this.handleReset),
      ...filterHighlighter( 'name', filteredInfo )
    },{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <ShowInDrawer id={record.id} Component={viewBusinessPartnerDrawer}>Details</ShowInDrawer>
          <Divider type="vertical" />
          <UpdateBusinessPartner BusinessPartner={record} />
          <Divider type="vertical" />
          <DeleteBusinessPartner BusinessPartner={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_BUSINESSPARTNERS }
          >
          {({ loading, data, error }) => {
            if(error) return <Error />
            
            return(
              <React.Fragment>  
                <Card title="3rd parties" extra={<CreateBusinessPartner />} style={{ background: '#fff' }}>
                <Table 
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={loading?[]:data.businessPartners}
                  columns={columns} 
                  onChange={this.handleChange} 
                  />
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default BusinessPartnersTable