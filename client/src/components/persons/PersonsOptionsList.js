import React from 'react'
import { PERSON_OPTIONS_LIST } from '../../queries/PersonQueries';
import { Query } from 'react-apollo'
import { Select } from 'antd';

const Option = Select.Option;

export class PersonsOptionsList extends React.Component {
  render() {
    return (
      <Query query = { PERSON_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          return(
            this.props.form.getFieldDecorator('person', {
              initialValue: this.props.id,
            })(
              <Select
                placeholder="No one"
                allowClear
                >
                {data.allPersons.map(d => <Option key={d.value}>{d.name}, {d.surname}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}