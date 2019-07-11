import gql from 'graphql-tag'

export const ALL_OU_TYPES = gql`
	query OrganizationalUnitTypes {
		organizationalUnitTypes{
			id
			name
			description
			reportingUnit
		}
	}
`;

export const OU_TYPES_OPTIONS_LIST = gql`
	query OrganizationalUnitTypes  ($filter: OrganizationalUnitTypeWhereInput) {
		organizationalUnitTypes(
			where:$filter
		) {
			value: id
			title: name
		}
	}
`;

export const GET_OU_TYPE = gql`
	query OrganizationalUnitType ($id: ID!) { 
		organizationalUnitType(where:{id: $id}) {
			id
			name
			description
			reportingUnit
		}
	}
`;

export const CREATE_OU_TYPE = gql`
	mutation CreateOrganizationalUnitType($data: OrganizationalUnitTypeCreateInput!) {
		createOrganizationalUnitType(data: $data) {
			id
		}
	}
`;

export const UPDATE_OU_TYPE = gql`
	mutation UpdateOrganizationalUnitType ($id: ID!, $data:OrganizationalUnitTypeUpdateInput!){
		updateOrganizationalUnitType(
			data: $data, 
			where: {id: $id}
		){
			id
		}
	}
`;


export const DELETE_OU_TYPE = gql`
	mutation DeleteOrganizationalUnitType ($id: ID!) {
		deleteOrganizationalUnitType(where:{id: $id}) {
			id
		}
	}
`;