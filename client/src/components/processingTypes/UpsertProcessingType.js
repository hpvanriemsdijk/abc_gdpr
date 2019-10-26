import React from 'react';
import GenericUpsertModal from '../generic/genericUpsert';
import { ALL_PROCESSING_TYPES, CREATE_PROCESSING_TYPE, GET_PROCESSING_TYPE, UPDATE_PROCESSING_TYPE } from '../../queries/ProcessingTypeQueries';

export function UpsertProcessingType(props) { 
  return(
    <GenericUpsertModal
      typeId = {props.id}
      typeName = "processingType"
      typeLabel = "Processing type"
      allQuery = { ALL_PROCESSING_TYPES }
      getQuery = { GET_PROCESSING_TYPE }
      createQuery = { CREATE_PROCESSING_TYPE }
      updateQuery = { UPDATE_PROCESSING_TYPE }
      />
  )
}