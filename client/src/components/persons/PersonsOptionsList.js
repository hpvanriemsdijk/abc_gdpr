import React from 'react'
import { PERSON_OPTIONS_LIST } from '../../queries/PersonQueries';
import { Query } from 'react-apollo'
import { Select, Alert } from 'antd';

const Option = Select.Option;

export class PersonsOptionsList extends React.Component {
  render() {
    return (
      <Query query = { PERSON_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          if(!data.persons.length){return <Alert message="There are no business roles defined, please do so!" type="warning" showIcon />}

          return(
            this.props.form.getFieldDecorator('person', {
              initialValue: this.props.id,
            })(
              <Select
                placeholder="No one"
                allowClear
                >
                {data.persons.map(d => <Option key={d.value}>{d.name}, {d.surname}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}