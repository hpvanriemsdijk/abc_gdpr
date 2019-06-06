import gql from 'graphql-tag'

export const ALL_DATA_TYPES = gql`
	query AllDataTypes ($filter: DataTypeFilter) {
		allDataTypes(
			filter:$filter
		) {
			id
			name
			pii
			spii
		}
	}
`;

export const DATA_TYPE_OPTIONS_LIST = gql`
	query AllDataTypes ($filter: DataTypeFilter) {
		allDataTypes(
			filter:$filter
		) {
			value: id
			title: name
		}
	}
`;

export const CREATE_DATA_TYPE = gql`
	mutation CreateDataType ($name: String!, $description: String, $pii: Boolean, $spii: Boolean) {
		createDataType(name: $name, description: $description, pii: $pii, spii: $spii) {
			id
		}
	}
`;

export const GET_DATA_TYPE = gql`
	query DataType ($id: ID!) { 
		DataType(id: $id) {
			id
			name
			description
			pii
			spii
		}
	}
`;

export const UPDATE_DATA_TYPE = gql`
	mutation UpdateDataType ($id: ID!, $name: String!, $description: String, $pii: Boolean, $spii: Boolean) {
		updateDataType(id: $id, name: $name, description: $description, pii: $pii, spii: $spii) {
			id
		}
	}
`;

export const DELETE_DATA_TYPE = gql`
	mutation DeleteDataType ($id: ID!) {
		deleteDataType(id: $id) {
			id
		}
	}
`;