import React from 'react'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Form, Switch } from 'antd';
import { ALL_PROCESSING_ACTIVITIES, PROCESSING_ACTIVITIES_BY_OU } from '../../queries/ProcessingActivitiesQueries';
import UpsertProcessingActivity from './UpsertProcessingActivity'
import DeleteProcessingActivity from './DeleteProcessingActivity'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { ShowInDrawer, Error } from '../generic/viewHelpers'
import ViewProcessingActivityDrawer from './ViewProcessingActivityDrawer'

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
          if(error) return <Error />
          
          return(            
            <div className="ant-table-title">
              <Form layout="inline" >
                <Form.Item label="Include nested">
                  <Switch 
                    checked={this.state.includeNested} 
                    onChange={this.handleToggle} 
                    />
                </Form.Item>
                <UpsertProcessingActivity processId={this.props.processId} organizationalUnitId={this.props.organizationalUnitId}/>
              </Form>
              
              <Table 
                loading={loading}
                rowKey={record => record.id}
                dataSource={loading?[]:data.processingActivities || data.processingActivitiesByOu}
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
          if(error) return <Error />

          //Component called from process details vieuw
          if(this.props.processId) return(
            <Table 
              loading={loading}
              rowKey={record => record.id}
              dataSource={loading?[]:data.processingActivities}
              columns={columns} 
              onChange={this.handleChange} 
              title={() => <UpsertProcessingActivity processId={this.props.processId}/>}
              />
          )

          //Component called from regular ProcessingActivity list view
          return(
            <React.Fragment>  
              <Card 
                title="Processing activities" 
                extra={<UpsertProcessingActivity { ...this.props } />} style={{ background: '#fff' }}
                >
              <Table 
                loading={loading}
                rowKey={record => record.id}
                rowClassName={(record, index) => record.updatedAt < 0 ? 'optimisticColumn' : '' }
                dataSource={loading?[]:data.processingActivities}
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
          <ShowInDrawer id={record.id} Component={ViewProcessingActivityDrawer}>Details</ShowInDrawer>
          <Divider type="vertical" />
          <UpsertProcessingActivity { ...this.props } activityId={record.id} />
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