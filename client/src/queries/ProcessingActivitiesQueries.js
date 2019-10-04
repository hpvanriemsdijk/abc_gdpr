import gql from 'graphql-tag'

export const ALL_PROCESSING_ACTIVITIES = gql`
	query ProcessingActivities ($filter: ProcessingActivityWhereInput){
		processingActivities(where: $filter){
			id
			name
			imController
			purpose
			process { id, name }
		}
	}
`;

export const PROCESSING_ACTIVITIES_BY_OU = gql`
	query ProcessingActivitiesByOu ($id: ID!) {
		processingActivitiesByOu(where:{id: $id}){
			id
			name
			imController
			purpose
			process{
				name
			}
		}
	}
`;

export const CREATE_PROCESSING_ACTIVITY = gql`
	mutation CreateProcessingActivity ($data: ProcessingActivityCreateInput!) {
		createProcessingActivity(data: $data) {
			id
		}
	}
`;

export const GET_PROCESSING_ACTIVITY = gql`
	query ProcessingActivity ($id: ID!) { 
		processingActivity(where:{id: $id}) {
			id
			name
			purpose
			imController
			process { id }
		}
	}
`;

export const UPDATE_PROCESSING_ACTIVITY = gql`
	mutation UpdateProcessingActivity ($id: ID!, $data:ProcessingActivityUpdateInput!) {
		updateProcessingActivity(
			data: $data, 
			where: {id: $id}
		) {
			id
		}
	}
`;

export const DELETE_PROCESSING_ACTIVITY = gql`
	mutation DeleteProcessingActivity ($id: ID!) {
		deleteProcessingActivity(where:{id: $id}) {
			id
		}
	}
`;