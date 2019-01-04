import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Tag } from 'antd';
import { ALL_APPLICATIONS } from '../../queries/ApplicationQueries';
import CreateApplication from './CreateApplication'
import UpdateApplication from './UpdateApplication'
import DeleteApplication from './DeleteApplication'
import { clientSideFilter } from '../generic/tableHelpers'

class ApplicationTable extends React.Component {
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
      <UpdateApplication application={record} />
      <Divider type="vertical" />
      <DeleteApplication application={record} />
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
      render: (text, record) => <Link to={`/applications/${record.id}`}>{text}</Link>,
    },{
      title: 'Aliasses',
      key: 'alias',
      dataIndex: 'alias',
      render: alias => (
        <span>
          { alias
            ? alias.map(alias => <Tag color="blue" key={alias}>{alias}</Tag>)
            : ""
          }
        </span>
      ),
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
          query = { ALL_APPLICATIONS }
          >
          {({ loading, data }) => {
            const dataSource = data.allApplications || [];

            return(
              <React.Fragment>  
                <Card title="Applications" extra={<CreateApplication />} style={{ background: '#fff' }}>
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

export default ApplicationTable