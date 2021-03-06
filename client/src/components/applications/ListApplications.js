import React from 'react'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Tag } from 'antd';
import { ALL_APPLICATIONS } from '../../queries/ApplicationQueries';
import CreateApplication from './CreateApplication'
import UpdateApplication from './UpdateApplication'
import DeleteApplication from './DeleteApplication'
import viewApplicationDrawer from './ViewApplication'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { ShowInDrawer, Error } from '../generic/viewHelpers'

class ApplicationTable extends React.Component {
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
          <ShowInDrawer id={record.id} Component={viewApplicationDrawer}>Details</ShowInDrawer>
          <Divider type="vertical" />
          <UpdateApplication application={record} />
          <Divider type="vertical" />
          <DeleteApplication application={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_APPLICATIONS }
          >
          {({ loading, data, error }) => {
            if(error) return <Error />

            return(
              <React.Fragment>  
                <Card title="Applications" extra={<CreateApplication />} style={{ background: '#fff' }}>
                <Table 
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={loading?[]:data.applications}
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