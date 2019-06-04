import gql from 'graphql-tag'

export const businessRolesEnums = {
	raci: [
		{ label: 'None', color: null, value: null },
		{ label: 'Respondsable', color: 'gold', value: 'RESPONDSABLE' },
		{ label: 'Accountable', color: 'red', value: 'ACCOUNTABLE' },
		{ label: 'Consulted', color: 'green', value: 'CONSULTED' },
		{ label: 'Informed', color: 'blue', value: 'INFORMED' }
	]
};

export const ALL_BUSINESS_ROLES = gql`
	query AllBusinessRoles ($filter: BusinessRoleFilter) {
		allBusinessRoles(
			filter:$filter
		) {
			id
			name
			description
		}
	}
`;


export const BUSINESS_ROLES_BY_OU = gql`
	query businessRoleByOu ($id: ID!) {
		businessRoleByOu(
			organizationalUnitId:$id
		) {
			id
			name
			description
			raciPrivacy
			raciSecurity
			raciFinancial
			raciExecutive
			person 
			organizationalUnit
		}
	}
`;

export const BUSINESS_ROLES_OPTIONS_LIST = gql`
	query AllBusinessRoles ($filter: BusinessRoleFilter) {
		allBusinessRoles(
			filter:$filter
		) {
			value: id
			title: name
		}
	}
`;

export const CREATE_BUSINESS_ROLE = gql`
	mutation CreateBusinessRole ($name: String!, $description: String, $person: ID, $organizationalUnit: ID, $raciPrivacy: RACI, $raciSecurity: RACI, $raciFinancial: RACI, $raciExecutive: RACI) {
		createBusinessRole(
			name: $name, 
			description: $description, 
			personId: $person, 
			organizationalUnitId: $organizationalUnit
			raciPrivacy: $raciPrivacy, 
			raciSecurity: $raciSecurity, 
			raciFinancial: $raciFinancial, 
			raciExecutive: $raciExecutive
		) {
			id
		}
	}
`;

export const GET_BUSINESS_ROLE = gql`
	query BusinessRole ($id: ID!) { 
		BusinessRole(id: $id) {
			id
			name
			description
			raciPrivacy
			raciSecurity
			raciFinancial
			raciExecutive
			person {
				id
				name
				surname
			}
		}
	}
`;

export const UPDATE_BUSINESS_ROLE = gql`
	mutation UpdateBusinessRole ($id: ID!, $name: String!, $description: String, $person: ID, $organizationalUnit: ID, $raciPrivacy: RACI, $raciSecurity: RACI, $raciFinancial: RACI, $raciExecutive: RACI) {
		updateBusinessRole(
			id: $id, 
			name: $name, 
			description: $description, 
			personId: $person, 
			organizationalUnitId: $organizationalUnit
			raciPrivacy: $raciPrivacy, 
			raciSecurity: $raciSecurity, 
			raciFinancial: $raciFinancial, 
			raciExecutive: $raciExecutive
		){
			id
		}
	}
`;

export const DELETE_BUSINESS_ROLE = gql`
	mutation DeleteBusinessRole ($id: ID!) {
		deleteBusinessRole(id: $id) {
			id
		}
	}
`;