import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Table, Divider, Input, Card, Tag, Icon, Form, Switch } from 'antd';
import { ALL_USERS } from '../../queries/UserQueries';
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import SetUserState from './SetUserState'
import './ListUsers.css';

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: null,
      sortedInfo: null, 
      filterDropdownVisible: false,
      searchText: '',
      filtered: false,
      activeAccounts: {active:true}
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
    console.log(this.props.users);
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      userData: this.props.users.map((record) => {
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

  userStateOptions  = (record) => {
    if( record.active ){
      return(
        <span>
          <UpdateUser user={record}/>
          <Divider type="vertical" />
          <SetUserState user={record} />
        </span>
      )
    }else{
      return(
        <span>
          <SetUserState user={record} />
          <Divider type="vertical" />
          Delete
        </span>
      )
    }
  }

  handleToggle = (checked) => {
    let activeAccounts = null;
    if (checked) activeAccounts = {active:true};

    this.setState({
      activeAccounts: activeAccounts
    });

    console.log("active", activeAccounts );
  }

  render () {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [{
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      sorter: (a, b) => a.active - b.active,
      sortOrder: sortedInfo.columnKey === 'active' && sortedInfo.order,
      render: (text) => {
        if (text) {
          return <Icon type="check-circle" theme="twoTone" />;
        }else{
          return <Icon type="stop" theme="twoTone" />;
        }
      }
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
    },{
	  title: 'Permissions',
	  key: 'specialPermissions',
	  dataIndex: 'specialPermissions',
	  render: specialPermissions => (
			<span>
			  { specialPermissions
					? specialPermissions.map(permission => <Tag color="blue" key={permission}>{permission}</Tag>)
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
          {this.userStateOptions(record)}
        </span>
      ),
    }];
    
    return (
      <div>
        <Query
          query = { ALL_USERS }
          variables= {{ active: this.state.activeAccounts }}
          >
          {({ loading, data }) => {
            const dataSource = data.allUsers || [];

            return(
              <React.Fragment>  
                <Card title="Application users" extra={<CreateUser />} style={{ background: '#fff' }}>
                <Form layout="inline">
                  <Form.Item label="Active accounts">
                    <Switch 
                      checked={this.state.activeAccounts != null} 
                      onChange={this.handleToggle} 
                      />
                  </Form.Item>
                </Form>
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
      </div>
    )
  }
}

export default UserTable