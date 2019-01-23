import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Empty } from 'antd';
import { ALL_BUSINESS_ROLES } from '../../queries/BusinessRoleQueries';
import CreateBusinessRole from './CreateBusinessRole'
import UpdateBusinessRole from './UpdateBusinessRole'
import DeleteBusinessRole from './DeleteBusinessRole'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class BusinessRoleTable extends React.Component {
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
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      ...clientSideFilter('description', this.searchInput, this.handleSearch, this.handleReset),
      ...filterHighlighter( 'description', filteredInfo )
    },{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={`/BusinessRoles/${record.id}`}>Details</Link>
          <Divider type="vertical" />
          <UpdateBusinessRole businessRole={record} />
          <Divider type="vertical" />
          <DeleteBusinessRole businessRole={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_BUSINESS_ROLES}
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.allBusinessRoles || [];

            return(
              <React.Fragment>  
                <Card title="Business roles" extra={<CreateBusinessRole />} style={{ background: '#fff' }}>
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

export default BusinessRoleTable