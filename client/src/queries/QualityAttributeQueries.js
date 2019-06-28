import gql from 'graphql-tag'

export const qualityAttributeEnums = {
	objects: [
		{ label: 'Data', color: 'gold', value: 'DATA' },
		{ label: 'Applications', color: 'red', value: 'APPLICATION' }
	]
};

export const ALL_QUALITY_ATTRIBUTES = gql`
	query AllQualityAttributes ($filter: QualityAttributeFilter) {
		allQualityAttributes(
			filter:$filter
		) {
			id
			name
			appliesToObject
			description
			classificationLabels {
				id
				score
				criteria
				label
			}
		}
	}
`;

export const CREATE_QUALITY_ATTRIBUTE = gql`
	mutation CreateQualityAttribute ($name: String!, $description: String, $appliesToObject: CLASSIFICATIONOBJECT!, $classificationLabels: [QualityAttributeclassificationLabelsClassificationLabel!]!) {
		createQualityAttribute(
			name: $name, 
			description: $description, 
			appliesToObject: $appliesToObject
			classificationLabels: $classificationLabels
		) {
			id
		}
	}
`;

export const GET_QUALITY_ATTRIBUTE = gql`
	query QualityAttribute ($id: ID!) { 
		QualityAttribute(id: $id) {
			id
			name
			description
			appliesToObject
			classificationLabels {
				id
				score
				label
				criteria
			}
		}
	}
`;

export const UPDATE_QUALITY_ATTRIBUTE = gql`
	mutation UpdateQualityAttribute ($id: ID!, $name: String!, $description: String, $appliesToObject: CLASSIFICATIONOBJECT!, $classificationLabels: [QualityAttributeclassificationLabelsClassificationLabel!]!) {
		updateQualityAttribute(
			id: $id, 
			name: $name, 
			description: $description, 
			appliesToObject: $appliesToObject
			classificationLabels: $classificationLabels
		) {
			id
		}
	}
`;

/* deletedOrphans is workarround for absence of cascade delete in graphcool */
export const DELETE_QUALITY_ATTRIBUTE = gql`
	mutation DeleteQualityAttribute ($id: ID!) {
		deleteQualityAttribute(id: $id) {
			id
		}

		deletedOrphans{
			orphans
			message
		}
	}
`;