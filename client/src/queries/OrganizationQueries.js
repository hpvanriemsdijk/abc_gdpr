import gql from 'graphql-tag'

export const ALL_ORGANIZATIONS = gql`
	query Organizations {
		organizations{
			id
			name
		}
	}
`;

export const CREATE_ORGANIZATION = gql`
	mutation CreateOrganization ($data: OrganizationCreateInput!) {
		createOrganization(data: $data) {
			id
		}
	}
`;

export const GET_ORGANIZATION = gql`
	query Organization ($id: ID!) { 
		organization(where: {id: $id}) {
			id
			name
			description
			dpo
 			representative
			contactDetails
			headOffice{
				name
				description
				address
			}
		}
	}
`;

export const UPDATE_ORGANIZATION = gql`
	mutation UpdateOrganization ($id: ID!, $data: OrganizationUpdateInput!) {
		updateOrganization(
			data: $data, 
			where: {id: $id}
		){
			id
		}
	}
`;

export const DELETE_ORGANIZATION = gql`
	mutation DeleteOrganization ($id: ID!) {
		deleteOrganization(where:{id: $id}) {
			id
		}
	}
`;