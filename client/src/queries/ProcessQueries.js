import gql from 'graphql-tag'

export const ALL_PROCESSES = gql`
	query Processes ($filter: ProcessWhereInput) {
		processes(where: $filter){
			id
			name
			description
			organizationalUnit { id, name }
			processOwner { id }
		}
	}
`;

export const PROCESSES_BY_OU = gql`
	query processByOu ($id: ID!) {
		processByOu(where:{id: $id}){
			id
			name
			description
			organizationalUnit{
				name
			}
			createdAt
			updatedAt 
		}
	}
`;


export const PROCESSS_OPTIONS_LIST = gql`
	query Processes  {
		processes {
			value: id
			title: name
		}
	}
`;

export const CREATE_PROCESS = gql`
	mutation CreateProcess ($data: ProcessCreateInput!) {
		createProcess(data: $data){
			id
		}
	}
`;

export const GET_PROCESS = gql`
	query Process ($id: ID!) { 
		process(where:{id: $id}) {
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
	mutation UpdateProcess ($id: ID!, $data: ProcessUpdateInput!) {
		updateProcess(
			data: $data, 
			where: {id: $id}
		) {
			id
		}
	}
`;

export const DELETE_PROCESS = gql`
	mutation DeleteProcess ($id: ID!) {
		deleteProcess(where:{id: $id}) {
			id
		}
	}
`;