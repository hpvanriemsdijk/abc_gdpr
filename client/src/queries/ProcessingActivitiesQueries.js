import gql from 'graphql-tag'

export const ALL_PROCESSING_ACTIVITIES = gql`
	query AllProcessingActivities ($filter: ProcessingActivityFilter) {
		allProcessingActivities(
			filter: $filter
		) {
			id
			name
			description
			purpose
			process { id, name }
		}
	}
`;

export const PROCESSING_ACTIVITIES_BY_OU = gql`
	query processingActivitiesByOu ($organizationalUnitId: ID!) {
		processingActivitiesByOu(organizationalUnitId:$organizationalUnitId){
			id
			name
			description
			purpose
			organizationalUnit
			process
		}
	}
`;


export const CREATE_PROCESSING_ACTIVITY = gql`
	mutation CreateProcessingActivity ($name: String!, $description: String, $purpose: String, $process: ID) {
		createProcessingActivity(
			name: $name, 
			description: $description, 
			purpose: $purpose, 
			processId: $process
		) {
			id
		}
	}
`;

export const GET_PROCESSING_ACTIVITY = gql`
	query ProcessingActivity ($id: ID!) { 
		ProcessingActivity(id: $id) {
			id
			name
			description
			purpose
			process { id }
		}
	}
`;

export const UPDATE_PROCESSING_ACTIVITY = gql`
	mutation UpdateProcessingActivity ($id: ID!, $name: String!, $description: String, $purpose: String, $process: ID) {
		updateProcessingActivity(
			id: $id, 
			name: $name, 
			description: 
			$description, 
			purpose: $purpose, 
			processId: $process
		) {
			id
		}
	}
`;

export const DELETE_PROCESSING_ACTIVITY = gql`
	mutation DeleteProcessingActivity ($id: ID!) {
		deleteProcessingActivity(id: $id) {
			id
		}
	}
`;