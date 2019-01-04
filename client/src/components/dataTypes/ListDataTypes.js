import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Tag } from 'antd';
import { ALL_DATA_TYPES } from '../../queries/DataTypeQueries';
import CreateDataType from './CreateDataType'
import UpdateDataType from './UpdateDataType'
import DeleteDataType from './DeleteDataType'
import { clientSideFilter } from '../generic/tableHelpers'

class DataTypeTable extends React.Component {
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
      <UpdateDataType dataType={record} />
      <Divider type="vertical" />
      <DeleteDataType dataType={record} />
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
      render: (text, record) => <Link to={`/DataTypes/${record.id}`}>{text}</Link>,
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
          {this.rowActions(record)}
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_DATA_TYPES }
          >
          {({ loading, data }) => {
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