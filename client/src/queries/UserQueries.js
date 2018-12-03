import gql from 'graphql-tag'

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
					lastName
					firstName
					permissions
			}
		}`, 
	view: gql`
		query viewUserQuery ($userId: ID!) { 
			User(id: $userId) {
				email
			}
		}`,
	authenticate: gql`
		mutation AuthenticateUserMutation ($email: String!, $password: String!) { 
			authenticateUser(email: $email, password: $password) {
				token
			}
		}`,
	create: gql`
		mutation CreateUserMutation ($email: String!, $firstName: String, $lastName: String, $permissions: [SpecialPermissions!]) {
			createUser(email: $email, firstName: $firstName, lastName: $lastName, permissions: $permissions) {
				id
			}
		}`
};

