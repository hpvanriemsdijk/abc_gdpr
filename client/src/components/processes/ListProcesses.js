import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card } from 'antd';
import { ALL_PROCESSES } from '../../queries/ProcessQueries';
import CreateProcess from './CreateProcess'
import UpdateProcess from './UpdateProcess'
import DeleteProcess from './DeleteProcess'
import './ListProcesses.css';
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class ProcessTable extends React.Component {
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

  rowActions  = (record) => {
    return(
    <span>
      <UpdateProcess organizationalUnit={record} />
      <Divider type="vertical" />
      <DeleteProcess organizationalUnit={record} />
    </span>
    )
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
      ...clientSideFilter('name', this.handleSearch, this.handleReset),
      render: (text, record) => <Link to={`/processes/${record.id}`}>{text}</Link>,
    },{
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      ...clientSideFilter('description', this.handleSearch, this.handleReset),
      ...filterHighlighter( this.state.searchText )
    },{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          {this.rowActions(record)}
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_PROCESSES }
          >
          {({ loading, data }) => {
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