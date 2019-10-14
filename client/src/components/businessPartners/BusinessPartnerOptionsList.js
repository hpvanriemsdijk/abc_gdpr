import React from 'react';
import { GenericOptionsList } from '../generic/genericOptionList';
import { BUSINESS_PARTNER_OPTIONS_LIST } from '../../queries/BusinessPartnerQueries';
import { useQuery } from '@apollo/react-hooks';

export function BusinessPartnerOptionsList(props) {
  let {relationName, label} = props;
  const type = "businessPartners";
  const query = useQuery( BUSINESS_PARTNER_OPTIONS_LIST );
    
  return(
    <GenericOptionsList 
      {...props}
      type = { type } 
      mode = "multiple"
      relationName = { !relationName?relationName=type:relationName } 
      label = { !label?label="Business Partner":label } 
      query = { query } 
      />
  )
}