import React from 'react'
import { BUSINESS_ROLES_OPTIONS_LIST } from '../../queries/BusinessRoleQueries';
import { Query } from 'react-apollo'
import { Select } from 'antd';

const Option = Select.Option;

export class BusinessRolessOptionsList extends React.Component {
  render() {
    return (
      <Query query = { BUSINESS_ROLES_OPTIONS_LIST } >
        {({ loading, data }) => {     
          if (loading) return (
            <Select placeholder="Loading..." />
          )

          return(
            this.props.form.getFieldDecorator('processOwner', {
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