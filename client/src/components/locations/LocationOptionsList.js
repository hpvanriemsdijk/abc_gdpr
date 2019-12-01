import React from 'react'
import { MY_LOCATIONS_OPTIONS_LIST } from '../../queries/LocationQueries';
import { GenericOptionsList } from '../generic/genericOptionList';
import { useQuery } from '@apollo/react-hooks';

export function LocationOptionsList(props) {
  const {relationName, label } = props;
  const type = "locations";
  const query = useQuery( MY_LOCATIONS_OPTIONS_LIST );

  return(
    <GenericOptionsList 
      { ...props } 
      type = { type }
      relationName = { !relationName?type:relationName } 
      label = { !label?"Location":label } 
      query = { query } 
      />
  )
}