import gql from 'graphql-tag'

export const ALL_DATA_TYPES = gql`
	query DataTypes {
		dataTypes{
			id
			name
			classificationLabels{
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
`;

export const DATA_TYPE_OPTIONS_LIST = gql`
	query DataTypes {
		dataTypes {
			value: id
			title: name
		}
	}
`;

export const CREATE_DATA_TYPE = gql`
	mutation CreateDataType ($data: DataTypeCreateInput!) {
		createDataType(data: $data) {
			id
		}
	}
`;

export const GET_DATA_TYPE = gql`
	query DataType ($id: ID!) { 
		dataType(where:{id: $id}) {
			id
			name
			description
			classificationLabels{
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
`;

export const UPDATE_DATA_TYPE = gql`
	mutation UpdateDataType ($id: ID!, $data: DataTypeUpdateInput!) {
		updateDataType(
			data: $data, 
			where: {id: $id}
		) {
			id
		}
	}
`;

export const DELETE_DATA_TYPE = gql`
	mutation DeleteDataType ($id: ID!) {
		deleteDataType(where:{id: $id}) {
			id
		}
	}
`;