import React from 'react';
import GenericViewDrawer from '../generic/genericViewDrawer';
import { GET_PROCESSING_TYPE } from '../../queries/ProcessingTypeQueries';

export function ViewProcessingTypeDrawer(props) { 
  if(!props.id){console.log("No ID!")}

  return(
    <GenericViewDrawer
      typeId = {props.id}
      typeName = "processingType"
      getQuery = { GET_PROCESSING_TYPE }
      />
  )
}