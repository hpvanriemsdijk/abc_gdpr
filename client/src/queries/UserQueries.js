import gql from 'graphql-tag'

export const userEnums = {
	specialPermissions: [
		{ label: 'Administrator', value: 'ADMIN' },
		{ label: 'Auditor', value: 'AUDIT' }
	]
};

export const LOGGEDIN_USER = gql`
	query LoggedInUser {
		loggedInUser {
			id
			email
		}
	}
`;

export const ALL_USERS = gql`
	query AllUsers ($filter: UserFilter) {
		allUsers(
			filter:$filter
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
	query User ($userId: ID!) { 
		user(id: $userId) {
			id
			active
			email
			specialPermissions
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser ($id: ID!, $active: Boolean, $email: String!, $specialPermissions: [PERMISSION!]) {
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

export const DELETE_USER = gql`
	mutation DeleteUser ($id: ID!) {
		deleteUser(id: $id) {
			id
		}
	}
`;

export const userQueries = {
	authenticate: gql`
		mutation AuthenticateUserMutation ($email: String!, $password: String!) { 
			authenticateUser(
				data:{
					email: $email, 
					password: $password
				}
			){
				token
			}
		}`,
};

