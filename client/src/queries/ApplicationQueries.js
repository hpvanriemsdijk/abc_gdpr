import gql from 'graphql-tag'

export const ALL_APPLICATIONS = gql`
	query AllApplications ($filter: ApplicationFilter) {
		allApplications(
			filter:$filter
		) {
			id
			name
			alias
			description
		}
	}
`;

export const CREATE_APPLICATION = gql`
	mutation CreateApplication ($name: String!, $description: String, $alias: [String!]) {
		createApplication(name: $name, description: $description, alias: $alias) {
			id
		}
	}
`;

export const GET_APPLICATION = gql`
	query Application ($id: ID!) { 
		Application(id: $id) {
			id
			name
			description
			alias
		}
	}
`;

export const UPDATE_APPLICATION = gql`
	mutation UpdateApplication ($id: ID!, $name: String!, $description: String, $alias: [String!]) {
		updateApplication(id: $id, name: $name, description: $description, alias: $alias) {
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