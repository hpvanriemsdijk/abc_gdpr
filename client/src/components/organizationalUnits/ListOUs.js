import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Empty } from 'antd';
import { ALL_OUS_TREE } from '../../queries/OUQueries';
import CreateOU from './CreateOU'
import UpdateOU from './UpdateOU'
import DeleteOU from './DeleteOU'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class OUTable extends React.Component {
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
    let { sortedInfo, filteredInfo  } = this.state;
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
      title: 'Type',
      key: 'organizationalUnitType.id',
      dataIndex: 'organizationalUnitType.name',
      sorter: (a, b) => a.organizationalUnitType.name - b.organizationalUnitType.name,
      sortOrder: sortedInfo.columnKey === 'organizationalUnitType.id' && sortedInfo.order,
    },{
      title: 'Processes',
      key: 'processes',
      dataIndex: '_processesMeta.count',
      sorter: (a, b) => a.processes - b.processes,
      sortOrder: sortedInfo.columnKey === 'processes' && sortedInfo.order,
    },{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={`/units/${record.id}`}>Details</Link>
          <Divider type="vertical" />
          <UpdateOU organizationalUnit={record} />
          <Divider type="vertical" />
          <DeleteOU organizationalUnit={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_OUS_TREE }
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.allOrganizationalUnits || [];
            return(
              <React.Fragment>  
                <Card title="Organizational units" extra={<CreateOU />} style={{ background: '#fff' }}>
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

export default OUTable