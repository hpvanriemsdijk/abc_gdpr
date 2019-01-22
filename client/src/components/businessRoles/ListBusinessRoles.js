import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card } from 'antd';
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
      searchText: '',
    };
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
    })
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({
      searchText: '',
    })
  }

  render () {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

    const columns = [{
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name)},
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      ...clientSideFilter('name', this.searchInput, this.handleSearch, this.handleReset),
      ...filterHighlighter( this.state.searchText )
    },{
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      ...clientSideFilter('description', this.searchInput, this.handleSearch, this.handleReset),
      ...filterHighlighter( this.state.searchText )
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
          {({ loading, data }) => {
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