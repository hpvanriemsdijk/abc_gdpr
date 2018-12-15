import gql from 'graphql-tag'

export const userEnums = {
	specialPermissions: [
		{ label: 'Administrator', value: 'ADMIN' },
		{ label: 'Auditor', value: 'AUDIT' }
	]
};

export const ALL_USERS = gql`
	query GetUsers ($active: UserFilter) {
		allUsers(
			filter:$active
		) {
			id
			active
			email
			specialPermissions
		}
	}
`;

export const CREATE_USER = gql`
	mutation CreateUser ($email: String!, $password: String!) {
		signupUser(email: $email, password: $password) {
			id
		}
	}
`;

export const GET_USER = gql`
	query ViewUser ($userId: ID!) { 
		User(id: $userId) {
			id
			active
			email
			specialPermissions
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser ($id: ID!, $active: Boolean!, $email: String!, $specialPermissions: [PERMISSION!]) {
		updateUser(id: $id, active: $active, email: $email, specialPermissions: $specialPermissions) {
			id
		}
	}
`;

export const SET_USER_STATE = gql`
	mutation SetUserState ($id: ID!, $active: Boolean!) {
		updateUser(id: $id, active: $active) {
			id
		}
	}
`;

export const userQueries = {
	loggedIn: gql`
		query LoggedInUserQuery {
			loggedInUser {
				id
				email
			}
		}`,
	view: gql`
		query viewUserQuery ($userId: ID!) { 
			User(id: $userId) {
				id
				active
				email
				specialPermissions
			}
		}`,
	authenticate: gql`
		mutation AuthenticateUserMutation ($email: String!, $password: String!) { 
			authenticateUser(email: $email, password: $password) {
				token
			}
		}`,
	create: gql`
		mutation CreateUserMutation ($email: String!, $password: String!) {
			signupUser(email: $email, password: $password) {
				id
			}
		}`,
	update: gql`
		mutation UpdateUserMutation ($id: ID!, $email: String!, $specialPermissions: [PERMISSION!]) {
			updateUser(id: $id, email: $email, specialPermissions: $specialPermissions) {
				id
			}
		}`
};

