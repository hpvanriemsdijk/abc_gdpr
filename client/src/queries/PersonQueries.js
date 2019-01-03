import gql from 'graphql-tag'

export const ALL_PERSONS = gql`
	query AllPersons ($filter: PersonFilter) {
		allPersons(
			filter:$filter
		) {
			id
			name
			surname
		}
	}
`;

export const CREATE_PERSON = gql`
	mutation CreatePerson ($name: String!, $surname: String) {
		createPerson(name: $name, surname: $surname) {
			id
		}
	}
`;

export const GET_PERSON = gql`
	query Person ($id: ID!) { 
		Person(id: $id) {
			id
			name
			surname
		}
	}
`;

export const UPDATE_PERSON = gql`
	mutation UpdatePerson ($id: ID!, $name: String!, $surname: String) {
		updatePerson(id: $id, name: $name, surname: $surname) {
			id
		}
	}
`;

export const DELETE_PERSON = gql`
	mutation DeletePerson ($id: ID!) {
		deletePerson(id: $id) {
			id
		}
	}
`;