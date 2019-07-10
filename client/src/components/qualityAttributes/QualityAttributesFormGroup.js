import React from 'react'
import { ALL_QUALITY_ATTRIBUTES } from '../../queries/QualityAttributeQueries.js';
import { Query } from 'react-apollo'
import { Select, Form, Icon, Popover } from 'antd';

const Option = Select.Option;

/*
 * @TODO: Add check on classification object (Data, application, exct ) 
 */
export class QualityAttributesFormGroup extends React.Component {
  popoverContent = (qualityAttribute) => {
    return(
      <span>
        <div>{qualityAttribute.description}. </div>
        <div>
          The following scoring creteria apply:
          <ul>
            {qualityAttribute.classificationLabels.map(classification => 
              <li key={classification.id}>{classification.label} ({classification.score}): {classification.criteria} </li>
            )}
          </ul>
        </div>
      </span>
    )
  }

  hussleClassifications = (classifications) => {
    let newData = {}

    if(classifications){
      for (var value of classifications.values()) {
          let qualityAttributeId = value.qualityAttribute.id;
          newData[qualityAttributeId] = value.id
      }
    }
    
    return newData
  }

  render() {
    const { form, classifications, scope } = this.props;
    let oldValues = this.hussleClassifications(classifications)

    return (  
      <Query 
        query = { ALL_QUALITY_ATTRIBUTES } 
        variables= {{ filter: { appliesToObject: scope } }}
        >
        {({ loading, data, error }) => {     
          if (loading) return <Select placeholder="Loading..." />
          if (error) return <Select placeholder="Error loading..." />
          let qualityAttributes = data.qualityAttributes
          let i = 0

          return(
            qualityAttributes.map( qualityAttribute =>
              <Form.Item 
                key={qualityAttribute.id}
                label={
                  <span>
                    {qualityAttribute.name}&nbsp;
                    <Popover title={qualityAttribute.name} content={this.popoverContent(qualityAttribute)}>
                      <Icon type="question-circle-o" />
                    </Popover>
                  </span>
                  }>
                {form.getFieldDecorator("classification[" + i++ + "]" , {
                  initialValue: oldValues[qualityAttribute.id],
                })(
                  <Select
                    placeholder="Classification"
                    allowClear
                    >
                    {qualityAttribute.classificationLabels.map(classification => 
                      <Option key={classification.id}>({classification.score}) {classification.label}</Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            )
          )
        }}
      </Query>
    )
  }
}