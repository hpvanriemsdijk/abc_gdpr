import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Row } from 'antd';
import { ALL_PROCESSING_ACTIVITIES } from '../../queries/ProcessingActivitiesQueries';
import CreateProcessingActivity from './CreateProcessingActivity'
import UpdateProcessingActivity from './UpdateProcessingActivity'
import DeleteProcessingActivity from './DeleteProcessingActivity'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class ProcessingActivityTable extends React.Component {
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

  rowActions = (record) => {
    return(
    <span>
      <UpdateProcessingActivity processingActivity={record} />
      <Divider type="vertical" />
      <DeleteProcessingActivity ProcessingActivity={record} />
    </span>
    )
  }

  getFilter = (props) =>{
    if(props.processId) return { filter: { process: { id: props.processId } } }
    return null
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
      render: (text, record) => <Link to={`/processingActivities/${record.id}`}>{text}</Link>,
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
          query = { ALL_PROCESSING_ACTIVITIES }
          variables = { this.getFilter(this.props) }
          >
          {({ loading, data }) => {
            const dataSource = data.allProcessingActivities || [];

            //Component called from process details vieuw
            if(this.props.processId) return(
              <span>
                <Row style={{ marginBottom: 16 }} type="flex" justify="end">
                  <CreateProcessingActivity processId={this.props.processId}/>
                </Row>
                <Row>
                  <Table 
                    loading={loading}
                    rowKey={record => record.id}
                    dataSource={dataSource}
                    columns={columns} 
                    onChange={this.handleChange} 
                    />
                </Row>
              </span>
            )

            return(
              <React.Fragment>  
                <Card title="Processing activities" extra={<CreateProcessingActivity />} style={{ background: '#fff' }}>
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

export default ProcessingActivityTable