import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card } from 'antd';
import { ALL_PROCESSES_TREE } from '../../queries/ProcessQueries';
import CreateProcess from './CreateProcess'
import UpdateProcess from './UpdateProcess'
import DeleteProcess from './DeleteProcess'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { ApolloError } from '../generic/apolloError'

class ProcessTable extends React.Component {
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
          <Link to={`/processes/${record.id}`}>Details</Link>
          <Divider type="vertical" />
          <UpdateProcess process={record} />
          <Divider type="vertical" />
          <DeleteProcess process={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_PROCESSES_TREE }
          >
          {({ loading, error, data }) => {
            if(error) return <ApolloError error={error} />
            const dataSource = data.allProcesses || [];          

            return(
              <React.Fragment>  
                <Card title="Processes" extra={<CreateProcess />} style={{ background: '#fff' }}>
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

export default ProcessTable