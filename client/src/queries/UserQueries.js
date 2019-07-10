import gql from 'graphql-tag'

export const userEnums = {
	specialPermissions: [
		{ label: 'Administrator', value: 'ADMIN' },
		{ label: 'Auditor', value: 'AUDIT' }
	]
};

export const ALL_USERS = gql`
	query Users ($filter: UserWhereInput){
		users(
			where:$filter
		){
			id
			active
			email
			specialPermissions
		}
	}
`;

export const CREATE_USER = gql`
	mutation CreateUser ($data: UserCreateInput!) {
		createUser(data: $data) {
			id
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser ($id: ID!, $data: UserUpdateInput!) {
		updateUser(
			data: $data, 
			where: {id: $id}
		) {
			id
		}
	}
`;

export const SET_USER_STATE = gql`
	mutation SetUserState ($id: ID!, $data: UserUpdateInput!) {
		updateUser(
			data: $data, 
			where: {id: $id}
		) {
			id
		}
	}
`;

export const DELETE_USER = gql`
	mutation DeleteUser ($id: ID!) {
		deleteUser(where:{id: $id}) {
			id
		}
	}
`;

export const AUTHENTICATE_USER =  gql`
	mutation AuthenticateUserMutation ($email: String!, $password: String!) { 
		authenticateUser(
			data:{
				email: $email, 
				password: $password
			}
		){
			token
		}
	}
`;