import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Empty, Form, Switch } from 'antd';
import { ALL_PROCESSING_ACTIVITIES, PROCESSING_ACTIVITIES_BY_OU } from '../../queries/ProcessingActivitiesQueries';
import CreateProcessingActivity from './CreateProcessingActivity'
import UpdateProcessingActivity from './UpdateProcessingActivity'
import DeleteProcessingActivity from './DeleteProcessingActivity'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class ProcessingActivityTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedInfo: null, 
      filteredInfo: null,
      includeNested: true
    };
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  handleToggle = (checked) => {
    let includeNested = false;
    if (checked) includeNested = true;

    this.setState({
      includeNested: includeNested
    });
  }

  handleSearch = (confirm) => {
    confirm();
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ filteredInfo: null });
  }

  processingActivityQuery = () => {
    if(this.state.includeNested){
      return {
        query: PROCESSING_ACTIVITIES_BY_OU,
        filter: { id: this.props.organizationalUnitId }
      }
    } else {
      return {
        query: ALL_PROCESSING_ACTIVITIES, 
        filter: { 
          filter: {
            process: { 
              organizationalUnit: { 
                id: this.props.organizationalUnitId 
              } 
            }
          }
        }
      }
    }
  }

  processingActivitiesByOu = (columns) => {
    return (
      <Query
        query = { this.processingActivityQuery().query }
        variables = { this.processingActivityQuery().filter } >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const dataSource = data.processingActivities || data.processingActivitiesByOu || [];

          return(            
            <div className="ant-table-title">
              <Form layout="inline" >
                <Form.Item label="Include nested">
                  <Switch 
                    checked={this.state.includeNested} 
                    onChange={this.handleToggle} 
                    />
                </Form.Item>
                <CreateProcessingActivity processId={this.props.processId}/>
              </Form>
              
              <Table 
                loading={loading}
                rowKey={record => record.id}
                dataSource={dataSource}
                columns={columns} 
                onChange={this.handleChange} 
                />
              </div>
          )}}
      </Query>
    )
  }

  processingActivities = (columns) => {
    return (
      <Query
        query = { ALL_PROCESSING_ACTIVITIES }
        >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const dataSource = data.processingActivities || [];

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

          //Component called from regular ProcessingActivity list view
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
      title: 'Process',
      key: 'process.name',
      dataIndex: 'process.name'
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

    if(this.props.organizationalUnitId){
      return this.processingActivitiesByOu(columns);
    }else{
      return this.processingActivities(columns);
    }
  }
}

export default ProcessingActivityTable