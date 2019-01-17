import gql from 'graphql-tag'

export const ALL_PROCESSES = gql`
	query AllProcesses ($filter: ProcessFilter) {
		allProcesses(
			filter:$filter
		) {
			id
			name
			description
			processOwner { id }
		}
	}
`;

export const ALL_PROCESSES_TREE = gql`
	fragment processTreeAllInfo on Process {
		id
		name
		description
		parent { id }
		processOwner { id }
	}
	
	query AllProcesses {
		allProcesses(
			filter:{parent: null}
		){
		...processTreeAllInfo
			children {
			...processTreeAllInfo
				children {
					...processTreeAllInfo
				}
			}
		}
	}
`;

//Max 3 levels
export const PROCESSES_OPTIONS_TREE = gql`
	fragment processTreeInfo on Process {
		value: id
		title: name
	}
	
	query ProcessTree {
		allProcesses(
			filter:{parent: null}
		){
		...processTreeInfo
			children {
			...processTreeInfo
				children {
					...processTreeInfo
				}
			}
		}
	}
`;

export const PROCESSES_BRANCH = gql`
	fragment processBranchInfo on Process {
		id
		name
	}

	query ProcessBranch ($id: ID!) { 
		Process(id: $id) {
			...processBranchInfo
			parent { 
				...processBranchInfo
				parent{
					...processBranchInfo
				}	
			}
			children { 
				...processBranchInfo
				children { 
					...processBranchInfo
				}
			}
		}
	}
`;


export const CREATE_PROCESS = gql`
	mutation CreateProcess ($name: String!, $description: String, $parent: ID, $processOwner: ID ) {
		createProcess(	
			name: $name, 
			description: $description, 
			parentId: $parent
			processOwnerId: $processOwner
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
			parent { id }
			processOwner { id, name }
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_PROCESS = gql`
	mutation UpdateProcess ($id: ID!, $name: String!, $description: String, $parent: ID, $processOwner: ID) {
		updateProcess(
			id: $id, 
			name: $name, 
			description: $description,
			parentId: $parent
			processOwnerId: $processOwner
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