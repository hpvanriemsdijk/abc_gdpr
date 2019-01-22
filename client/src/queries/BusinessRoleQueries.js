import gql from 'graphql-tag'

export const businessRolesEnums = {
	raci: [
		{ label: 'None', value: null },
		{ label: 'Respondsable', value: 'RESPONDSABLE' },
		{ label: 'Accountable', value: 'ACCOUNTABLE' },
		{ label: 'Consulted', value: 'CONSULTED' },
		{ label: 'Informed', value: 'INFORMED' }
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
	mutation CreateBusinessRole ($name: String!, $description: String, $raciPrivacy: RACI, $raciSecurity: RACI, $raciFinancial: RACI, $raciExecutive: RACI) {
		createBusinessRole(name: $name, description: $description, raciPrivacy: $raciPrivacy, raciSecurity: $raciSecurity, raciFinancial: $raciFinancial, raciExecutive: $raciExecutive) {
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
		}
	}
`;

export const UPDATE_BUSINESS_ROLE = gql`
	mutation UpdateBusinessRole ($id: ID!, $name: String!, $description: String, $raciPrivacy: RACI, $raciSecurity: RACI, $raciFinancial: RACI, $raciExecutive: RACI) {
		updateBusinessRole(id: $id, name: $name, description: $description, raciPrivacy: $raciPrivacy, raciSecurity: $raciSecurity, raciFinancial: $raciFinancial, raciExecutive: $raciExecutive) {
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