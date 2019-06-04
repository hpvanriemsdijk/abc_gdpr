import React from 'react'
import { PROCESSS_OPTIONS_LIST } from '../../queries/ProcessQueries';
import { Query } from 'react-apollo'
import { Select } from 'antd';

const Option = Select.Option;

export class ProcessOptionsList extends React.Component {
  render() {
    return (
      <Query query = { PROCESSS_OPTIONS_LIST } >
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
                {data.allProcesses.map(d => <Option key={d.value}>{d.title}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}