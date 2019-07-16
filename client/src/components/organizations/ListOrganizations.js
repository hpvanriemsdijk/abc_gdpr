import React from 'react'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Empty } from 'antd';
import { ALL_ORGANIZATIONS  } from '../../queries/OrganizationQueries';
import CreateOrganization from './CreateOrganization'
import UpdateOrganization from './UpdateOrganization'
import DeleteOrganization from './DeleteOrganization'
import viewOrganizationDrawer from './ViewOrganization'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { ShowInDrawer } from '../generic/viewHelpers'

class OrganizationsTable extends React.Component {
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
          <ShowInDrawer id={record.id} Component={viewOrganizationDrawer}>Details</ShowInDrawer>
          <Divider type="vertical" />
          <UpdateOrganization Organization={record} />
          <Divider type="vertical" />
          <DeleteOrganization Organization={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_ORGANIZATIONS }
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.organizations || [];

            return(
              <React.Fragment>  
                <Card title="3rd parties" extra={<CreateOrganization />} style={{ background: '#fff' }}>
                <Table 
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={dataSource}
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

export default OrganizationsTable