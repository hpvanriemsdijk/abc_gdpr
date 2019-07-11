import React from 'react'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Empty } from 'antd';
import { ALL_OU_TYPES } from '../../queries/OUTypeQueries';
import CreateOUType from './CreateOUType'
import UpdateOUType from './UpdateOUType'
import DeleteOUType from './DeleteOUType'
import viewOUTypeDrawer from './ViewOUType'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { ShowInDrawer } from '../generic/viewHelpers'

class OUTypesTable extends React.Component {
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
          <ShowInDrawer id={record.id} Component={viewOUTypeDrawer}>Details</ShowInDrawer>
          <Divider type="vertical" />
          <UpdateOUType OUType={record} />
          <Divider type="vertical" />
          <DeleteOUType OUType={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_OU_TYPES }
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.organizationalUnitTypes || [];

            return(
              <React.Fragment>  
                <Card title="Organizational unit types" extra={<CreateOUType />} style={{ background: '#fff' }}>
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

export default OUTypesTable