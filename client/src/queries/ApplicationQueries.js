import gql from 'graphql-tag'

export const ALL_APPLICATIONS = gql`
	query Applications {
		applications{
			id
			name
			alias
		}
	}
`;

export const CREATE_APPLICATION = gql`
	mutation CreateApplication ($data: ApplicationCreateInput!) {
		createApplication(data: $data) {
			id
		}
	}
`;

export const GET_APPLICATION = gql`
	fragment businessRole on BusinessRole {
		id
		name
		person {
			id
			name 
			surname
		}
	}

	query Application ($id: ID!) { 
		application(where: {id: $id}) {
			id
			name
			description
			alias
			dataTypes {
				id
				name
				description
			}
			businessOwner {
				...businessRole
			}
			itOwner {
				...businessRole
			}
			securityAdministrator{
				...businessRole
			}
		}
	}
`;

export const UPDATE_APPLICATION = gql`
	mutation UpdateApplication ($id: ID!, $data: ApplicationUpdateInput!) {
		updateApplication(
			data: $data, 
			where: {id: $id}
		){
			id
		}
	}
`;

export const DELETE_APPLICATION = gql`
	mutation DeleteApplication ($id: ID!) {
		deleteApplication(where:{id: $id}) {
			id
		}
	}
`;