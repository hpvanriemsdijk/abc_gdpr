import gql from 'graphql-tag'

export const ALL_APPLICATIONS = gql`
	query AllApplications ($filter: ApplicationFilter) {
		allApplications(
			filter:$filter
		) {
			id
			name
			alias

		}
	}
`;

export const CREATE_APPLICATION = gql`
	mutation CreateApplication ($name: String!, $description: String, $alias: [String!], $dataType: [ID!], $businessOwner: ID, $itOwner: ID, $securityAdministrator:ID ) {
		createApplication(
			name: $name, 
			description: $description, 
			alias: $alias,
			dataTypeIds: $dataType,
			businessOwnerId: $businessOwner,
			itOwnerId: $itOwner,
			securityAdministratorId: $securityAdministrator
		) {
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
		Application(id: $id) {
			id
			name
			description
			alias
			dataType {
				id
				name
				description
				pii
				spii
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
	mutation UpdateApplication ($id: ID!, $name: String!, $description: String, $alias: [String!], $dataType: [ID!], $businessOwner: ID, $itOwner: ID, $securityAdministrator:ID) {
		updateApplication(
			id: $id, 
			name: $name, 
			description: $description, 
			alias: $alias,
			dataTypeIds: $dataType,
			businessOwnerId: $businessOwner,
			itOwnerId: $itOwner,
			securityAdministratorId: $securityAdministrator
		) {
			id
		}
	}
`;

export const DELETE_APPLICATION = gql`
	mutation DeleteApplication ($id: ID!) {
		deleteApplication(id: $id) {
			id
		}
	}
`;