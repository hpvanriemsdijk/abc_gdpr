import gql from 'graphql-tag'

export const userEnums = {
	specialPermissions: [
		{ label: 'Administrator', value: 'ADMIN' },
		{ label: 'Auditor', value: 'AUDIT' }
	]
}

export const userQueries = {
	loggedIn: gql`
		query LoggedInUserQuery {
			loggedInUser {
				id
				email
			}
		}`,
	all: gql`
		query AllUsersQuery {
				allUsers{
					id
					active
					email
					specialPermissions
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
		mutation CreateUserMutation ($email: String!, $specialPermissions: [SpecialPermissions!]) {
			createUser(email: $email, specialPermissions: $specialPermissions) {
				id
			}
		}`
};

