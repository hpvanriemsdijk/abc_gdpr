import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Empty, Alert } from 'antd';
import { ALL_PROCESSES, PROCESSES_BY_OU } from '../../queries/ProcessQueries';
import CreateProcess from './CreateProcess'
import UpdateProcess from './UpdateProcess'
import DeleteProcess from './DeleteProcess'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

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

  getFilter = (props) =>{
    if(props.organizationalUnitId) return { filter: { organizationalUnit: { id: props.organizationalUnitId } } }
    return { filter: null } 
  }

  allProcesses = (columns) =>{
    return (
      <Query
        query = { ALL_PROCESSES }
        variables = { this.getFilter(this.props) }
        >
        {({ loading, error, data }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const dataSource = data.allProcesses || [];    

          return(
            <React.Fragment>  
              <Card title="Processes" extra={<CreateProcess />} style={{ background: '#fff' }}>
              <Alert
                message="Informational Note"
                description="You are looking at all processes from all OU's right now, you might want to drill down starting from the OU view."
                type="info"
                closable
                showIcon
              />

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

  processesByOu = (columns) => {
    return (
      <Query
        query = { PROCESSES_BY_OU }
        variables = {{ organizationalUnitId: this.props.organizationalUnitId }}
        >
        
        {({ loading, error, data }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const dataSource = data.processByOu || [];  

          //Component called from process details vieuw
          return(
            <Table 
              loading={loading}
              rowKey={record => record.id}
              dataSource={dataSource}
              columns={columns} 
              onChange={this.handleChange} 
              title={() => <CreateProcess organizationalUnitId={this.props.organizationalUnitId}/>}
              />         
          )
        }}
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
      title: 'Organizational Unit',
      key: 'organizationalUnit.name',
      dataIndex: 'organizationalUnit.name',
      ...clientSideFilter('organizationalUnit.name', this.searchInput, this.handleSearch, this.handleReset),
      ...filterHighlighter( 'organizationalUnit.name', filteredInfo )
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

    if(this.props.organizationalUnitId){
      return this.processesByOu(columns);
    }else{
      return this.allProcesses(columns);
    }
  }
}

export default ProcessTable