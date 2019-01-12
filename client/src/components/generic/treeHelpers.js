import React from 'react'
import { PROCESSES_OPTIONS_TREE } from '../../queries/ProcessQueries';
import { Query } from 'react-apollo'
import { TreeSelect } from 'antd';

/*
  * Take an optionsdata object to 
  * - Disable the own key
  * - Remove everything deeper than 2 levels of nesting (3 levels)
  * - Prevent creating a loop --> cant select childeren in own tree
  * - Disable options that will lead to nesting deeper than 3 levels
  */
export class ProcessesParentTree extends React.Component {
  prepOptionsTree = (obj, ownKey = null) => {
    var disableLine = false;
    var ownDepth = 0;
    var self = this;

    //Get childeren depth of ownKey
    if(ownKey){
      obj.forEach(function(itemsL1) {  
        if(itemsL1.value === ownKey){
          ownDepth = self.getDepth(itemsL1);
        }else{
          if(itemsL1.children) itemsL1.children.forEach(function(itemsL2){
            if(itemsL2.value === ownKey) ownDepth = self.getDepth(itemsL2);
          })
        }
      })
    }

    //Set not allowed options to disabled
    obj.forEach(function(itemsL1) {      
      itemsL1.value === ownKey || ownDepth > 2
        ? itemsL1.disabled = disableLine = true 
        : itemsL1.disabled = disableLine = false; 
      if(itemsL1.children) itemsL1.children.forEach(function(itemsL2){
        itemsL2.value === ownKey || disableLine || ownDepth > 1
          ? itemsL2.disabled = true 
          : itemsL2.disabled = false 
        if(itemsL2.children) itemsL2.children.forEach(function(itemsL3){
          itemsL3.disabled = true 
          if(itemsL3.children) itemsL3.children = null 
        })
      })
    });

    return obj
  };

  getDepth = (obj) => {
    var depth = 0;
    var self = this;

    if (obj.children) {
        obj.children.forEach(function (d) {
            var tmpDepth = self.getDepth(d)
            if (tmpDepth > depth) {
                depth = tmpDepth
            }
        })
    }
    return 1 + depth
  }

  render() {
    return (
      <Query query = { PROCESSES_OPTIONS_TREE } >
        {({ loading, data }) => {     
          if (loading) return (
            <TreeSelect placeholder="Loading..." />
          )

          return(
            this.props.form.getFieldDecorator('parent', {
              initialValue: this.props.parentId,
            })(
              <TreeSelect
                placeholder="No parent"
                allowClear
                treeData={this.prepOptionsTree(data.allProcesses, this.props.ownKey)}
                >
            </TreeSelect>
            )
          )
        }}
      </Query>
    )
  }
}