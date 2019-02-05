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
		processOwner { id }
		organizationalUnit { name }
	}
	
	query AllProcesses ($filter: ProcessFilter) {
		allProcesses(
			filter:$filter
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

export const PROCESSES_TREE_BY_OU = gql`
	query procesTreeByOu ($organizationalUnitId: ID!) {
		procesTreeByOu(organizationalUnitId:$organizationalUnitId){
			id
			name
			description
			children
			organizationalUnit
			createdAt
			updatedAt 
		}
	}
`;


//Max 3 levels
// ProcessFilter = {parent: null}
// ProcessFilter = {AND: [{parent: null}, {organizationalUnit: {id:"cjrcga2fg06hv0169xw9nxzft"}}] }
export const PROCESSES_OPTIONS_TREE = gql`
	fragment processTreeInfo on Process {
		value: id
		title: name
	}
	
	query ProcessTree ($filter: ProcessFilter) {
		allProcesses(
			filter:$filter
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
	mutation CreateProcess ($name: String!, $description: String, $parent: ID, $processOwner: ID, $organizationalUnit: ID ) {
		createProcess(	
			name: $name, 
			description: $description, 
			parentId: $parent
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
			parent { id }
			processOwner { id, name }
			organizationalUnit { id, name }
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_PROCESS = gql`
	mutation UpdateProcess ($id: ID!, $name: String!, $description: String, $parent: ID, $processOwner: ID, $organizationalUnit: ID) {
		updateProcess(
			id: $id, 
			name: $name, 
			description: $description,
			parentId: $parent
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