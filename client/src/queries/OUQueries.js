import gql from 'graphql-tag'

export const ALL_OUS = gql`
	query AllOrganizationalUnits ($filter: OrganizationalUnitFilter) {
		allOrganizationalUnits(
			filter:$filter
		) {
			id
			name
			organizationalUnitType { id, name, reportingUnit }
			_processesMeta{count}
		}
	}
`;

export const ALL_OUS_TREE = gql`
	fragment OUTreeAllInfo on OrganizationalUnit {
		id
		name
		organizationalUnitType {
			id
			name
			reportingUnit
		}
		_processesMeta{count}
	}

	query AllOrganizationalUnits {
		allOrganizationalUnits(
			filter:{parent: null}
		){
		...OUTreeAllInfo
			children {
			...OUTreeAllInfo
				children {
					...OUTreeAllInfo
				}
			}
		}
	}
`;

export const OU_OPTIONS_TREE = gql`
	fragment OUTreeInfo on OrganizationalUnit {
		value: id
		title: name
	}
	
	query OuTree {
		allOrganizationalUnits(
			filter:{parent: null}
		){
		...OUTreeInfo
			children {
			...OUTreeInfo
				children {
					...OUTreeInfo
				}
			}
		}
	}
`;

export const OU_BRANCH = gql`
	fragment ouBranchInfo on OrganizationalUnit {
		id
		name
	}

	query OuBranch ($id: ID!) { 
		OrganizationalUnit(id: $id) {
			...ouBranchInfo
			parent { 
				...ouBranchInfo
				parent{
					...ouBranchInfo
				}	
			}
			children { 
				...ouBranchInfo
				children { 
					...ouBranchInfo
				}
			}
		}
	}
`;

export const CREATE_OU = gql`
	mutation CreateOrganizationalUnit (
		$name: String!, 
		$description: String, 
		$parent: ID
		$organizationalUnitType: ID!
	){
		createOrganizationalUnit(
			name: $name, 
			description: $description, 
			parentId: $parent,
			organizationalUnitTypeId: $organizationalUnitType,
		) {
			id,
			name,
			description,
			organizationalUnitType {id, name},
			_processesMeta{count} 
		}
	}
`;

export const GET_OU = gql`
	query OrganizationalUnit ($id: ID!) { 
		OrganizationalUnit(id: $id) {
			id
			name
			description
			organizationalUnitType { id, name, description, reportingUnit }
			parent { id }
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_OU = gql`
	mutation UpdateOrganizationalUnit (
		$id: ID!, 
		$name: String!, 
		$description: String, 
		$parent: ID
		$organizationalUnitType: ID!
	){
		updateOrganizationalUnit(
			id: $id, 
			name: $name, 
			description: $description, 
			parentId: $parent,
			organizationalUnitTypeId: $organizationalUnitType,
		){
			id, 
			name, 
			organizationalUnitType {id, name},
			_processesMeta{count} 
		}
	}
`;

export const DELETE_OU = gql`
	mutation DeleteOrganizationalUnit ($id: ID!) {
		deleteOrganizationalUnit(id: $id) {
			id
		}
	}
`;