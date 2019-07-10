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
	query BusinessRoles{
		businessRoles {
			id
			name
			description
		}
	}
`;


export const BUSINESS_ROLES_BY_OU = gql`
	query BusinessRoleByOu ($id: ID!) {
		businessRoleByOu(where:{id:$id}) {
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
			}
			organizationalUnit {
				id
				name
			}
		}
	}
`;

export const BUSINESS_ROLES_OPTIONS_LIST = gql`
	query BusinessRoles {
		businessRoles {
			value: id
			title: name
		}
	}
`;

export const CREATE_BUSINESS_ROLE = gql`
	mutation CreateBusinessRole ($data: BusinessRoleCreateInput!) {
		createBusinessRole(data: $data) {
			id
		}
	}
`;

export const GET_BUSINESS_ROLE = gql`
	query BusinessRole ($id: ID!) { 
		businessRole(where:{id: $id}) {
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
	mutation UpdateBusinessRole ($id: ID!, $data: ApplicationUpdateInput!) {
		updateBusinessRole(
			data: $data, 
			where: {id: $id}
		){
			id
		}
	}
`;

export const DELETE_BUSINESS_ROLE = gql`
	mutation DeleteBusinessRole ($id: ID!) {
		deleteBusinessRole(where:{id: $id}) {
			id
		}
	}
`;