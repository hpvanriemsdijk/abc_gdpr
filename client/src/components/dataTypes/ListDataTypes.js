import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Tag, Empty } from 'antd';
import { ALL_DATA_TYPES } from '../../queries/DataTypeQueries';
import CreateDataType from './CreateDataType'
import UpdateDataType from './UpdateDataType'
import DeleteDataType from './DeleteDataType'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class DataTypeTable extends React.Component {
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
      title: 'Classifications',
      key: 'classifications',
      dataIndex: 'classifications',
      filters: [
        {text: 'Personal data', value: "pii"},
        {text: 'Sensitive personal data', value: "spii"},
      ],
      onFilter: (value, record) => {
        return record[value];
      },
      render: (text, record) => {
        if(record.spii){return(<Tag color="blue">Sensitive personal data</Tag>)}
        if(record.pii){return(<Tag color="blue">Personal data</Tag>)}
      }
    },{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={`/DataTypes/${record.id}`}>Details</Link>
          <Divider type="vertical" />
          <UpdateDataType dataType={record} />
          <Divider type="vertical" />
          <DeleteDataType dataType={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_DATA_TYPES }
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.allDataTypes || [];

            return(
              <React.Fragment>  
                <Card title="Data types" extra={<CreateDataType />} style={{ background: '#fff' }}>
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

export default DataTypeTable