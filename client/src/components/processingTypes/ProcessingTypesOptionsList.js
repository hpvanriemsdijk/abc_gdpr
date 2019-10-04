import React from 'react'
import { PROCESSING_TYPE_OPTIONS_LIST } from '../../queries/ProcessingTypeQueries';
import { Query } from 'react-apollo'
import { Select, Alert } from 'antd';

const Option = Select.Option;

export class ProcessingTypesOptionsList extends React.Component {
  render() {
    return (  
      <Query query = { PROCESSING_TYPE_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          if(!data.processingTypes.length){return <Alert message="There are no processing types defined, please do so!" type="warning" showIcon />}

          return(
            this.props.form.getFieldDecorator(this.props.field, {
              initialValue: this.props.id,
            })(
              <Select
                placeholder="--- non selected ---"
                allowClear
                mode="multiple"
                >
                {data.processingTypes.map(d => <Option key={d.value}>{d.title}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}