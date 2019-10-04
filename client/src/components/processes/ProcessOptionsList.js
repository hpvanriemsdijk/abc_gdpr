import React from 'react'
import { PROCESSS_OPTIONS_LIST } from '../../queries/ProcessQueries';
import { Query } from 'react-apollo'
import { Select } from 'antd';

const Option = Select.Option;

export class ProcessOptionsList extends React.Component {
  processQuery = () => {
    if(this.props.organizationalUnitId){
      console.log(1);
      return {
        query: PROCESSS_OPTIONS_LIST, 
        variables: { 
          filter: {
            organizationalUnit: { 
              id: this.props.organizationalUnitId 
            } 
          }
        }
      }
    } else {
      return {
        query: PROCESSS_OPTIONS_LIST
      }
    }
  }

  render() {
    return (
      <Query {...this.processQuery()} >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />

          return(
            this.props.form.getFieldDecorator('parentProcess', {
              initialValue: this.props.id,
            })(
              <Select
                placeholder="No parent process"
                allowClear
                >
                {data.processes.map(d => <Option key={d.value}>{d.title}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}