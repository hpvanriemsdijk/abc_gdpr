import gql from 'graphql-tag'

export const ALL_DATA_TYPES = gql`
	query AllDataTypes ($filter: DataTypeFilter) {
		allDataTypes(
			filter:$filter
		) {
			id
			name
			classification {
				classificationLabel{
					id
					score
					label
					qualityAttribute{
						id
						name
					}
				}
			}
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
	mutation CreateDataType ($name: String!, $description: String, $classification: [DataTypeclassificationClassification!]!) {
		createDataType(
			name: $name, 
			description: $description, 
			classification: $classification
		) {
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
			classification {
				classificationLabel{
					id
					score
					label
					criteria
					qualityAttribute{
						id
						name
						description
					}
				}
			}
		}
	}
`;

export const UPDATE_DATA_TYPE = gql`
	mutation UpdateDataType ($id: ID!, $name: String!, $description: String, $classification: [DataTypeclassificationClassification!]!) {
		updateDataType(
			id: $id, 
			name: $name, 
			description: $description, 
			classification: $classification
		) {
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