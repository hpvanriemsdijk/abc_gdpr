import React from 'react'
import { BUSINESS_ROLES_OPTIONS_LIST } from '../../queries/BusinessRoleQueries';
import { Query } from 'react-apollo'
import { TreeSelect } from 'antd';

export class BusinessRolessOptionsList extends React.Component {
  render() {
    return (
      <Query query = { BUSINESS_ROLES_OPTIONS_LIST } >
        {({ loading, data }) => {     
          if (loading) return (
            <TreeSelect placeholder="Loading..." />
          )

          return(
            this.props.form.getFieldDecorator('processOwner', {
              initialValue: this.props.id,
            })(
              <TreeSelect
                placeholder="No role"
                allowClear
                treeData={data.allBusinessRoles}
                >
            </TreeSelect>
            )
          )
        }}
      </Query>
    )
  }
}