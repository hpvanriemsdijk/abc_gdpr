import React from 'react'
import { DATA_TYPE_OPTIONS_LIST } from '../../queries/DataTypeQueries';
import { Query } from 'react-apollo'
import { Select } from 'antd';

const Option = Select.Option;

export class DataTypeOptionsList extends React.Component {
  render() {
    return (
      <Query query = { DATA_TYPE_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          console.log(this.props.initialValue);
          let initialValues = []

          if(this.props.initialValue){
            this.props.initialValue.map(d =>
              initialValues.push(d.id)
            )
          }

          return(
            this.props.form.getFieldDecorator('dataTypes', {
              initialValue: initialValues,
            })(
              <Select
                placeholder="Select data types"
                mode="multiple"
                allowClear
                >
                {data.allDataTypes.map(d => <Option key={d.value}>{d.title}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}