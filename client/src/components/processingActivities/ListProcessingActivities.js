import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Empty } from 'antd';
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

  getFilter = (props) =>{
    if(props.processId) return { filter: { process: { id: props.processId } } }
    return null
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
          <Link to={`/processingActivities/${record.id}`}>Details</Link>
          <Divider type="vertical" />
          <UpdateProcessingActivity processingActivity={record} />
          <Divider type="vertical" />
          <DeleteProcessingActivity ProcessingActivity={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_PROCESSING_ACTIVITIES }
          variables = { this.getFilter(this.props) }
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.allProcessingActivities || [];

            //Component called from process details vieuw
            if(this.props.processId) return(
              <Table 
                loading={loading}
                rowKey={record => record.id}
                dataSource={dataSource}
                columns={columns} 
                onChange={this.handleChange} 
                title={() => <CreateProcessingActivity processId={this.props.processId}/>}
                />
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
                  //onRow={(record, index) => ({
                  //  onClick: (event) => { 
                  //    console.log("click", record)
                  //   } 
                  //})}
                  />
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default ProcessingActivityTable