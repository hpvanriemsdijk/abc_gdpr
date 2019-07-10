import React from 'react'
import { Query } from 'react-apollo'
import { Table, Divider, Input, Card, Tag, Icon, Form, Switch, Button } from 'antd';
import { ALL_USERS } from '../../queries/UserQueries';
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import SetUserState from './SetUserState'
import DeleteUser from './DeleteUser'
import './ListUsers.css';

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: null, 
      filterDropdownVisible: false,
      searchText: '',
      searchBoxText: '',
      filtered: false,
      activeAccounts: {active:true}
    };
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  }

  onInputChange = (e) => {
    this.setState({ searchBoxText: e.target.value });
  }

  onSearch = () => {
    const searchText = this.state.searchBoxText;
    this.setState({
      filterDropdownVisible: false,
      searchText: searchText,
      filtered: !!searchText,
    })
  }

  clearSearch = () => {
    this.setState({
      searchText: '',
      searchBoxText: ''
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
            value={this.state.searchBoxText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
        </div>
        <div className="search-filter-dropdown-btns" >
          <div>
          <Button style={{ margin:1 }} type="primary" onClick={this.onSearch} size="small">Search</Button>
          <Button style={{ margin:1 }} onClick={this.clearSearch} size="small">Reset</Button>
          </div>
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
          <DeleteUser user={record} />
        </span>
      )
    }
  }

  handleToggle = (checked) => {
    let activeAccounts = {};
    if (checked) activeAccounts = {active:true};

    this.setState({
      activeAccounts: activeAccounts
    });
  }

  render () {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

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
      sorter: (a, b) => { return a.email.localeCompare(b.email)},
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      //render: (text, record) => (
      //  <Link to={`/users/${record.id}`}>{text}</Link>
      //),
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
          fetchPolicy="cache-and-network"
          variables= {{ filter: 
            { AND: [
              this.state.activeAccounts,
              {email_contains: this.state.searchText}
            ]}
          }}
          >
          {({ loading, data }) => {
            const dataSource = data.users || [];

            return(
              <React.Fragment>  
                <Card title="Application users" extra={<CreateUser />} style={{ background: '#fff' }}>
                <Form layout="inline">
                  <Form.Item label="Active accounts">
                    <Switch 
                      checked={this.state.activeAccounts.active} 
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