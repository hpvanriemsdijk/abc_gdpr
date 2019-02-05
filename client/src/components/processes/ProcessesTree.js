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
  * - if this.props.organizationalUnitId is set, only processes within that OU are given
  */
export class ProcessesTree extends React.Component {
  getFilter = () =>{
    console.log(this.props)
    if(this.props.organizationalUnitId) return { filter: { parent: null, organizationalUnit: { id: this.props.organizationalUnitId } } }
    return { filter:{parent: null} }
  }

  render() {
    return (
      <Query 
        query = { PROCESSES_OPTIONS_TREE } 
        variables = { this.getFilter() }
        >
        {({ loading, data, error }) => {   
          if (error) return <TreeSelect disabled={true} placeholder="Error loading..." />  
          if (loading) return <TreeSelect disabled={true} placeholder="Loading..." />
          let isDisabled = this.props.disabled || false;
          let parentTree = this.props.parentTree;

          return(
            this.props.form.getFieldDecorator('process', {
              initialValue: this.props.parentId,
              hidden: isDisabled
            })(
              <TreeSelect
                placeholder="No process..."
                disabled={isDisabled}
                treeData={prepOptionsTree(data.allProcesses, this.props.ownKey, parentTree)}
                >
            </TreeSelect>
            )
          )
        }}
      </Query>
    )
  }
}