import gql from 'graphql-tag'

export const ALL_PROCESSING_ACTIVITIES = gql`
	query AllProcessingActivities ($filter: ProcessingActivityFilter) {
		allProcessingActivities(
			filter:$filter
		) {
			id
			name
			description
			purpose
		}
	}
`;

export const CREATE_PROCESSING_ACTIVITY = gql`
	mutation CreateProcessingActivity ($name: String!, $description: String, $purpose: String) {
		createProcessingActivity(name: $name, description: $description, purpose: $purpose) {
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
		}
	}
`;

export const UPDATE_PROCESSING_ACTIVITY = gql`
	mutation UpdateProcessingActivity ($id: ID!, $name: String!, $description: String, $purpose: String) {
		updateProcessingActivity(id: $id, name: $name, description: $description, purpose: $purpose) {
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