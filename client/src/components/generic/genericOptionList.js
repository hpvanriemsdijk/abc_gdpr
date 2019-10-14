import React from 'react'
import { isArray, isString } from 'lodash';
import { Select, Form } from 'antd';

export class GenericOptionsList extends React.Component {
    render() {
        const Option = Select.Option;
        const {type, form, relationName, label, required, query, extra, mode } = this.props;
        let { initialValue } = this.props;
        const rules = required?{ rules: [ { required: true, message: 'This field is required!' } ] }:""
        let mappedInitialValues = [];

        if(initialValue && isArray(initialValue)){
            initialValue.map(d =>
                mappedInitialValues.push(d.id)
            )
        }else if(initialValue && isString(initialValue)){
            mappedInitialValues = initialValue
        }

        const select = () => {
            if (query.loading) return <Select placeholder="Loading..." />
            if (query.error) return <Select placeholder="Error loading..." />
            return(
                <Select
                placeholder="--- non selected ---"
                allowClear
                mode = { mode }
                >
                {query.data[type].map(d => <Option key={d.value}>{d.title}</Option>)}
                </Select>
            )
        }

        const extraText = () => {
            if (!query.loading && !query.data[type].length){
                return "There are no " + label + ", add some!";
            }
            if(extra){
                return extra;
            }
        }

        return (  
            <Form.Item 
                label={label}
                extra={extraText()}
                >{
                form.getFieldDecorator(relationName, {
                initialValue: mappedInitialValues,
                ...rules
                })(select())
            }</Form.Item>
        )
    }
}
