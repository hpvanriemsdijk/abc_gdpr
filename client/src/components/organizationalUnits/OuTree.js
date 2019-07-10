import React from 'react'
import { OU_OPTIONS_TREE } from '../../queries/OUQueries';
import { Query } from 'react-apollo'
import { TreeSelect } from 'antd';
import { prepOptionsTree } from '../generic/treeHelpers'

/*
 *  Return a OU treeselect
 *
 *  ownKey: The leaf ownKey will be highlighted as current leaf
 *  parentTree: if true, 3rd level will be disabled. if false 3rd level will be selecable
 *  disabled: disable tree select
 */
export class OuTree extends React.Component {
  render() {
    return (
      <Query query = { OU_OPTIONS_TREE } >
        {({ loading, data, error }) => {   
          if (error) return <TreeSelect disabled={true} placeholder="Error loading..." />  
          if (loading) return <TreeSelect disabled={true} placeholder="Loading..." />
          let isDisabled = this.props.disabled || false;
          let parentTree = this.props.parentTree

          return(
            this.props.form.getFieldDecorator('organizationalUnit', {
              initialValue: this.props.parentId,
              hidden: isDisabled
            })(
              <TreeSelect
                placeholder="No organizational Unit..."
                disabled={isDisabled}
                allowClear
                treeData={prepOptionsTree(data.organizationalUnits, this.props.ownKey, parentTree)}
                >
            </TreeSelect>
            )
          )
        }}
      </Query>
    )
  }
}