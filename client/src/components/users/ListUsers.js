import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { Layout, Spin, Table, Divider, Input, Card, Tag } from 'antd';
import { userQueries } from 'queries/UserQueries';
import ViewUser from './ViewUser'
import CreateUser from './CreateUser'

import './ListUsers.css';

const { Content } = Layout;

class listUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: null,
      sortedInfo: null, 
      filterDropdownVisible: false,
      searchText: '',
      filtered: false,
      userData: null,
    };
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  }

  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  onSearch = () => {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      userData: this.props.AllUsers.allUsers.map((record) => {
        const match = record.email.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          name: (
            <span>
              {record.email.split(reg).map((text, i) => (
                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  }

  clearSearch = () => {
    this.setState({
            searchText: ''
        }, () => {
            this.onSearch()
        });
  }

  filterDropdown(){
    return(
      <div className="search-filter-dropdown">
        <div style={{ padding:8 }}>
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search e-mail"
            value={this.state.searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
        </div>
        <div className="search-filter-dropdown-btns" >
          <a style={{ float: 'left', minWidth: '50px' }} onClick={this.onSearch} >OK</a>
          <a style={{ float: 'left', minWidth: '50px' }} onClick={this.clearSearch}>Clear</a>
        </div>
      </div>
    )
  }

  render () {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    if (this.props.AllUsers.loading) {
      return (<div><Spin /> Loading</div>)
    }

    if (this.props.AllUsers.error) {
      console.log(this.props.AllUsers.error)
      return (<div>An unexpected error occurred</div>)
    }

    const columns = [{
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      sorter: (a, b) => a.active - b.active,
      sortOrder: sortedInfo.columnKey === 'active' && sortedInfo.order,
      render: (text) => {
        if (text) {
          return "Yes";
        }else{
          return "No";
        }
      },
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      filteredValue: filteredInfo.active || null,
      filterMultiple: false,
      onFilter: (value, record) => record.active == value,
    },{
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      render: (text, record) => (
        <Link to={`/users/${record.id}`}>{text}</Link>
      ),
      filterDropdown: this.filterDropdown(),
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        }, () => this.searchInput && this.searchInput.focus());
      },
    }, {
      title: 'First Name',
      dataIndex: 'First Name',
      key: 'firstName',
      sorter: (a, b) => a.firstName.length - b.firstName.length,
      sortOrder: sortedInfo.columnKey === 'firstName' && sortedInfo.order,
    }, {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName - b.lastName,
      sortOrder: sortedInfo.columnKey === 'lastName' && sortedInfo.order,
    },{
	  title: 'Permissions',
	  key: 'permissions',
	  dataIndex: 'permissions',
	  render: permissions => (
			<span>
			  { permissions
					? permissions.map(permission => <Tag color="blue" key={permission}>{permission}</Tag>)
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
          <a href="#">Edit </a>
          <Divider type="vertical" />
          <a href="#">Delete</a>
        </span>
      ),
    }];

    return (
      <div>
        <Card title="Application users" extra={<CreateUser />} style={{ background: '#fff' }}>
          <Table columns={columns} 
              dataSource={this.state.userData || this.props.AllUsers.allUsers}
              rowKey="id" 
              onChange={this.handleChange} />
        </Card>
        {this.props.match.params.userId &&
          <Content style={{ marginTop: 24 }}>
            <ViewUser userId={this.props.match.params.userId} />
          </Content>
          }
      </div>
    )
  }
}

export default compose(
  graphql(userQueries.all, {
    name: 'AllUsers'
  })
)(withRouter(listUsers))