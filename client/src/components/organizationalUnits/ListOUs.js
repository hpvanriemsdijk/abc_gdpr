import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Tag } from 'antd';
import { ALL_OUS } from '../../queries/OUQueries';
import CreateOU from './CreateOU'
import UpdateOU from './UpdateOU'
import DeleteOU from './DeleteOU'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class OUTable extends React.Component {
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
      ...clientSideFilter('name', this.handleSearch, this.handleReset),
      ...filterHighlighter( this.state.searchText )
    },{
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      ...clientSideFilter('description', this.handleSearch, this.handleReset),
      ...filterHighlighter( this.state.searchText )
    },{
      title: 'Legal Entity',
      key: 'legalEntity',
      dataIndex: 'legalEntity',
      sorter: (a, b) => a.legalEntity - b.legalEntity,
      sortOrder: sortedInfo.columnKey === 'legalEntity' && sortedInfo.order,
      render: (text) => {
        if (text) {
          return (
            <Tag color="blue">yes</Tag>
            );
        }else{
          return (
            <Tag color="blue">No</Tag>
            );
        }
      }
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
          query = { ALL_OUS }
          >
          {({ loading, data }) => {
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