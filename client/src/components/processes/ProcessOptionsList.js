import React from 'react'
import { PROCESSS_OPTIONS_LIST } from '../../queries/ProcessQueries';
import { GenericOptionsList } from '../generic/genericOptionList';
import { useQuery } from '@apollo/react-hooks';

export function ProcessOptionsList(props) {
  const {relationName, label, organizationalUnitId } = props;
  const type = "processes";
  let filter = {}

  if(organizationalUnitId){
    filter = {
      variables: { 
        filter: {
          organizationalUnit: { 
            id: organizationalUnitId 
          } 
        }
      }
    }
  }
 
  const query = useQuery( PROCESSS_OPTIONS_LIST, filter );

  return(
    <GenericOptionsList 
      { ...props } 
      type = { type }
      relationName = { !relationName?type:relationName } 
      label = { !label?"Process":label } 
      query = { query } 
      />
  )
}