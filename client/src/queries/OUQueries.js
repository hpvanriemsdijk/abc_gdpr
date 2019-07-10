import gql from 'graphql-tag'

export const ALL_OUS_TREE = gql`
	fragment OUTreeAllInfo on OrganizationalUnit {
		id
		name
		organizationalUnitType {
			id
			name
			reportingUnit
		}
	}

	query AllOrganizationalUnits {
		organizationalUnits(
			where:{parent: null}
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
		organizationalUnits(
			where:{parent: null}
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
		organizationalUnit(where:{id: $id}) {
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
	mutation CreateOrganizationalUnit ($data: OrganizationalUnitCreateInput!){
		createOrganizationalUnit(data: $data) {
			id,
			name,
			description,
			organizationalUnitType {id, name},
		}
	}
`;

export const GET_OU = gql`
	query OrganizationalUnit ($id: ID!) { 
		organizationalUnit(where:{id: $id}) {
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
	mutation UpdateOrganizationalUnit ($id: ID!, $data:OrganizationalUnitUpdateInput!){
		updateOrganizationalUnit(
			data: $data, 
			where: {id: $id}
		){
			id
		}
	}
`;

export const DELETE_OU = gql`
	mutation DeleteOrganizationalUnit ($id: ID!) {
		deleteOrganizationalUnit(
			where:{id: $id}
		) {
			id
		}
	}
`;