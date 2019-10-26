import React from 'react';
import GenericList from '../generic/genericList';
import { ALL_PROCESSING_TYPES } from '../../queries/ProcessingTypeQueries';
import { ViewProcessingTypeDrawer } from '../processingTypes/ViewProcessingTypeDrawer'
import { DeleteProcessingType } from '../processingTypes/DeleteProcessingType'
import { UpsertProcessingType } from '../processingTypes/UpsertProcessingType'

export default function ListProcessingTypes(props) { 
  return(
    <GenericList
      typeName = "processingTypes"
      typeLabel = "Processing type"
      allQuery = { ALL_PROCESSING_TYPES }
      ViewComponent = {ViewProcessingTypeDrawer}
      UpsertComponent = {UpsertProcessingType}
      DeleteComponent = {DeleteProcessingType}
      />
  )
}