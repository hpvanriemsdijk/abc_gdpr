import React from 'react';
import { GenericOptionsList } from '../generic/genericOptionList';
import { PROCESSING_TYPE_OPTIONS_LIST } from '../../queries/ProcessingTypeQueries';
import { useQuery } from '@apollo/react-hooks';

export function ProcessingTypesOptionsList(props) {
  let {relationName, label} = props;
  const type = "processingTypes"
  const query = useQuery( PROCESSING_TYPE_OPTIONS_LIST );
    
  return(
    <GenericOptionsList 
      {...props}
      type = { type }
      mode = "multiple"
      relationName = { !relationName?relationName=type:relationName } 
      label = { !label?label="Processing type":label } 
      query = { query } 
      />
  )
}