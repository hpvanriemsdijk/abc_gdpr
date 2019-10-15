import React from 'react';
import { GenericOptionsList } from '../generic/genericOptionList';
import { LEGAL_GROUND_OPTIONS_LIST } from '../../queries/StaticSettingQueries';
import { useQuery } from '@apollo/react-hooks';

export function LegalGroundOptionsList(props) {
  let {relationName, label} = props;
  const type = "staticSettingsGroup"
  const query = useQuery( LEGAL_GROUND_OPTIONS_LIST );
    
  return(
    <GenericOptionsList 
      {...props}
      type = { type }
      mode = "multiple"
      relationName = { !relationName?relationName=type:relationName } 
      label = { !label?label="Legal ground":label } 
      query = { query } 
      />
  )
}