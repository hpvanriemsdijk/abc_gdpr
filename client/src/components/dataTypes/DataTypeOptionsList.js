import React from 'react';
import { GenericOptionsList } from '../generic/genericOptionList';
import { DATA_TYPE_OPTIONS_LIST } from '../../queries/DataTypeQueries';
import { useQuery } from '@apollo/react-hooks';

export function DataTypeOptionsList(props) {
  let {relationName, label} = props;
  const type = "dataTypes"
  const query = useQuery( DATA_TYPE_OPTIONS_LIST );
    
  return(
    <GenericOptionsList 
      {...props}
      type = { type }
      mode = "multiple"
      relationName = { !relationName?relationName=type:relationName } 
      label = { !label?label="Data type":label } 
      query = { query } 
      />
  )
}