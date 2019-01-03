import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Card } from 'antd';
import { ALL_PERSONS } from '../../queries/PersonQueries';
import CreatePerson from './CreatePerson'
import UpdatePerson from './UpdatePerson'
import DeletePerson from './DeletePerson'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'

class PersonTable extends React.Component {
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
      <UpdatePerson person={record} />
      <Divider type="vertical" />
      <DeletePerson person={record} />
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
      render: (text, record) => <Link to={`/persons/${record.id}`}>{text}</Link>,
    },{
      title: 'Surname',
      key: 'surname',
      dataIndex: 'surname',
      sorter: (a, b) => { return a.surname.localeCompare(b.name)},
      sortOrder: sortedInfo.columnKey === 'surname' && sortedInfo.order,
      ...clientSideFilter('surname', this.handleSearch, this.handleReset),
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
          query = { ALL_PERSONS }
          >
          {({ loading, data }) => {
            const dataSource = data.allPersons || [];

            return(
              <React.Fragment>  
                <Card title="Persons" extra={<CreatePerson />} style={{ background: '#fff' }}>
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

export default PersonTable