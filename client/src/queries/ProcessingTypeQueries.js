import gql from 'graphql-tag'

export const PROCESSING_TYPE_OPTIONS_LIST = gql`
	query ProcessingTypes {
		processingTypes {
			value: id
			title: name
		}
	}
`;

export const ALL_PROCESSING_TYPES = gql`
	query ProcessingTypes {
		processingTypes {
			id
			name
			description
		}
	}
`;

export const CREATE_PROCESSING_TYPE = gql`
	mutation CreateProcessingType ($data: ProcessingTypeCreateInput!) {
		createProcessingType(data: $data) {
			id
            name
            description 
		}
	}
`;

export const GET_PROCESSING_TYPE = gql`
	query ProcessingType ($id: ID!) { 
		processingType(where:{id: $id}) {
			id
			name
			description
		}
	}
`;

export const UPDATE_PROCESSING_TYPE = gql`
	mutation UpdateProcessingType ($id: ID!, $data: ProcessingTypeUpdateInput!) {
		updateProcessingType(
			data: $data, 
			where: {id: $id}
		) {
			id
			name
			description
		}
	}
`;

export const DELETE_PROCESSING_TYPE = gql`
	mutation DeleteProcessingType ($id: ID!) {
		deleteProcessingType(where:{id: $id}) {
			id
		}
	}
`;