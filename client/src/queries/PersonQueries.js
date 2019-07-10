import gql from 'graphql-tag'

export const ALL_PERSONS = gql`
	query Persons {
		persons {
			id
			name
			surname
		}
	}
`;

export const PERSON_OPTIONS_LIST = gql`
	query Persons {
		persons {
			value: id
			name
			surname
		}
	}
`;

export const CREATE_PERSON = gql`
	mutation CreatePerson ($data: PersonCreateInput!) {
		createPerson(data: $data) {
			id
		}
	}
`;

export const GET_PERSON = gql`
	query Person ($id: ID!) { 
		person(where:{id: $id}) {
			id
			name
			surname
		}
	}
`;

export const UPDATE_PERSON = gql`
	mutation UpdatePerson ($id: ID!, $data: PersonUpdateInput!) {
		updatePerson(
			data: $data, 
			where: {id: $id}
		) {
			id
		}
	}
`;

export const DELETE_PERSON = gql`
	mutation DeletePerson ($id: ID!) {
		deletePerson(where:{id: $id}) {
			id
		}
	}
`;