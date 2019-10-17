import React from 'react';
import GenericUpsertModal from '../generic/genericUpsert';
import { ALL_LEGAL_GROUNDS, CREATE_LEGAL_GROUND, GET_LEGAL_GROUND, UPDATE_LEGAL_GROUND } from '../../queries/LegalGroundQueries';

export function UpsertLegalGround(props) { 
  return(
    <GenericUpsertModal
      typeId = {props.id}
      typeName = "LegalGround"
      typeLabel = "Legal ground"
      allQuery = { ALL_LEGAL_GROUNDS }
      getQuery = { GET_LEGAL_GROUND }
      createQuery = { CREATE_LEGAL_GROUND }
      updateQuery = { UPDATE_LEGAL_GROUND }
      />
  )
}