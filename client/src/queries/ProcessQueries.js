import gql from 'graphql-tag'

export const ALL_PROCESSES = gql`
	query AllProcesses ($filter: ProcessFilter) {
		allProcesses(
			filter:$filter
		) {
			id
			name
			description
		}
	}
`;

export const CREATE_PROCESS = gql`
	mutation CreateProcess ($name: String!, $description: String) {
		createProcess(name: $name, description: $description) {
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
		}
	}
`;

export const UPDATE_PROCESS = gql`
	mutation UpdateProcess ($id: ID!, $name: String!, $description: String) {
		updateProcess(id: $id, name: $name, description: $description) {
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