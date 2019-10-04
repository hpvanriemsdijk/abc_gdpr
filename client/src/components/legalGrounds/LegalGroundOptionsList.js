import React from 'react'
import { LEGAL_GROUND_OPTIONS_LIST } from '../../queries/LegalGroundQueries';
import { Query } from 'react-apollo'
import { Select, Alert } from 'antd';

const Option = Select.Option;

export class LegalGroundOptionsList extends React.Component {
  render() {
    return (  
      <Query query = { LEGAL_GROUND_OPTIONS_LIST } >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          if(!data.legalGrounds.length){return <Alert message="There are no legal grounds defined, please do so!" type="warning" showIcon />}
          
          return(          
            <Select
              placeholder="--- non selected ---"
              allowClear
              mode="multiple"
              >
              {data.legalGrounds.map(d => (<Option key={d.value} >{d.title} </Option>))}
            </Select>
          )
        }}
      </Query>
    )
  }
}