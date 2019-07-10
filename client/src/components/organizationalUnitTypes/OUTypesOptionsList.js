import React from 'react'
import { OU_TYPES_OPTIONS_LIST } from '../../queries/OUTypeQueries';
import { Query } from 'react-apollo'
import { Select, Form } from 'antd';

const Option = Select.Option;

export class OUTypesOptionsList extends React.Component {
  render() {
    return (
      <Query query = { OU_TYPES_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />

          return(
            <Form.Item label="Unit type">
              {this.props.form.getFieldDecorator('organizationalUnitType', {
                initialValue: this.props.id,
                rules:[
                  { required: true, message: 'OU Type is needed!' }
                ]
              })(           
                <Select
                  placeholder="Please select a OU Type"
                  >
                  {data.organizationalUnitTypes.map(d => <Option key={d.value}>{d.title}</Option>)}
                </Select>
              )}
            </Form.Item>
          )
        }}
      </Query>
    )
  }
}
