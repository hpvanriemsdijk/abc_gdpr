import gql from 'graphql-tag'

export const ALL_PROCESSES = gql`
	query AllProcesses ($filter: ProcessFilter) {
		allProcesses(
			filter:$filter
		) {
			id
			name
			description
			organizationalUnit { id, name }
			processOwner { id }
		}
	}
`;

export const PROCESSES_BY_OU = gql`
	query processByOu ($organizationalUnitId: ID!) {
		processByOu(organizationalUnitId:$organizationalUnitId){
			id
			name
			description
			organizationalUnit
			createdAt
			updatedAt 
		}
	}
`;


export const PROCESSS_OPTIONS_LIST = gql`
	query AllProcesses ($filter: ProcessFilter) {
		allProcesses(
			filter:$filter
		) {
			value: id
			title: name
		}
	}
`;

export const CREATE_PROCESS = gql`
	mutation CreateProcess ($name: String!, $description: String, $processOwner: ID, $organizationalUnit: ID ) {
		createProcess(	
			name: $name, 
			description: $description, 
			processOwnerId: $processOwner
			organizationalUnitId: $organizationalUnit
		){
			id
		}
	}
`;

export const GET_PROCESS = gql`
	query Process ($id: ID!) { 
		Process(id: $id) {
			id
			name
			description
			processOwner { id, name }
			organizationalUnit { id, name }
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_PROCESS = gql`
	mutation UpdateProcess ($id: ID!, $name: String!, $description: String, $processOwner: ID, $organizationalUnit: ID) {
		updateProcess(
			id: $id, 
			name: $name, 
			description: $description,
			processOwnerId: $processOwner
			organizationalUnitId: $organizationalUnit
		) {
			id
		}
	}
`;

export const DELETE_PROCESS = gql`
	mutation DeleteProcess ($id: ID!) {
		deleteProcess(id: $id) {
			id
		}
	}
`;