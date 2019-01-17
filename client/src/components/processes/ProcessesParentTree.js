import React from 'react'
import { PROCESSES_OPTIONS_TREE } from '../../queries/ProcessQueries';
import { Query } from 'react-apollo'
import { TreeSelect } from 'antd';
import { prepOptionsTree } from '../generic/treeHelpers'

/*
  * Take an optionsdata object to 
  * - Disable the own key
  * - Remove everything deeper than 2 levels of nesting (3 levels)
  * - Prevent creating a loop --> cant select childeren in own tree
  * - Disable options that will lead to nesting deeper than 3 levels
  */
export class ProcessesParentTree extends React.Component {
  render() {
    return (
      <Query query = { PROCESSES_OPTIONS_TREE } >
        {({ loading, data }) => {     
          if (loading) return <TreeSelect placeholder="Loading..." />
          const isDisabled = this.props.disabled || false;

          return(
            this.props.form.getFieldDecorator('process', {
              initialValue: this.props.parentId,
              hidden: isDisabled
            })(
              <TreeSelect
                placeholder="No process..."
                disabled={isDisabled}
                treeData={prepOptionsTree(data.allProcesses, this.props.ownKey)}
                >
            </TreeSelect>
            )
          )
        }}
      </Query>
    )
  }
}