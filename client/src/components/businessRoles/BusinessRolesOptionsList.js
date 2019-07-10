import React from 'react'
import { BUSINESS_ROLES_OPTIONS_LIST } from '../../queries/BusinessRoleQueries';
import { Query } from 'react-apollo'
import { Select, Alert } from 'antd';

const Option = Select.Option;

export class BusinessRolesOptionsList extends React.Component {
  render() {
    return (  
      <Query query = { BUSINESS_ROLES_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          if(!data.businessRoles.length){return <Alert message="There are no business roles defined, please do so!" type="warning" showIcon />}

          return(
            this.props.form.getFieldDecorator(this.props.field, {
              initialValue: this.props.id,
            })(
              <Select
                placeholder="No role"
                allowClear
                >
                {data.businessRoles.map(d => <Option key={d.value}>{d.title}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}