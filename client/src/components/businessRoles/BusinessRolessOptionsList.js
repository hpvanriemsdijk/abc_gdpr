import React from 'react'
import { BUSINESS_ROLES_OPTIONS_LIST } from '../../queries/BusinessRoleQueries';
import { Query } from 'react-apollo'
import { Select } from 'antd';

const Option = Select.Option;

export class BusinessRolessOptionsList extends React.Component {
  render() {
    return (  
      <Query query = { BUSINESS_ROLES_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />

          return(
            this.props.form.getFieldDecorator(this.props.field, {
              initialValue: this.props.id,
            })(
              <Select
                placeholder="No role"
                allowClear
                >
                {data.allBusinessRoles.map(d => <Option key={d.value}>{d.title}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}