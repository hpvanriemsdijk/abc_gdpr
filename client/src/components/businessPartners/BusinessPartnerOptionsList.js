import React from 'react'
import { BUSINESS_PARTNER_OPTIONS_LIST } from '../../queries/BusinessPartnerQueries';
import { Query } from 'react-apollo'
import { Select, Alert } from 'antd';

const Option = Select.Option;

export class BusinessPartnerOptionsList extends React.Component {
  render() {
    return (  
      <Query query = { BUSINESS_PARTNER_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          if(!data.businessPartners.length){return <Alert message="There are no business partners defined, please do so!" type="warning" showIcon />}
  
          let initialValues = [];
          if(this.props.initialValue){
            this.props.initialValue.map(d =>
              initialValues.push(d.id)
            )
          }

          return(
            this.props.form.getFieldDecorator(this.props.field, {
              initialValue: initialValues,
            })(
              <Select
                placeholder="--- non selected ---"
                allowClear
                mode="multiple"
                >
                {data.businessPartners.map(d => <Option key={d.value}>{d.title}</Option>)}
              </Select>
            )
          )
        }}
      </Query>
    )
  }
}