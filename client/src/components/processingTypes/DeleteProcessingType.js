import React from 'react';
import GenericDelete from '../generic/genericDelete';
import { GET_PROCESSING_TYPE, ALL_PROCESSING_TYPES, DELETE_PROCESSING_TYPE } from '../../queries/ProcessingTypeQueries';

export function DeleteProcessingType(props) { 
  const { id } = props

  return(
    <GenericDelete
      typeName = "processingType"
      typeLabel = "Processing type"
      typeId = { id }
      getQuery = { GET_PROCESSING_TYPE }
      allQuery = { ALL_PROCESSING_TYPES }
      deteleQuery = { DELETE_PROCESSING_TYPE }
      />
  )
}