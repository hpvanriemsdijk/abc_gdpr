import gql from 'graphql-tag'

export const ALL_OU_TYPES = gql`
	query AllOrganizationalUnitTypes {
		id
		name
		description
		reportingUnit
	}
`;

export const OU_TYPES_OPTIONS_LIST = gql`
	query AllOrganizationalUnitTypes  ($filter: OrganizationalUnitTypeFilter) {
		allOrganizationalUnitTypes(
			filter:$filter
		) {
			value: id
			title: name
		}
	}
`;

export const UPDATE_OU_TYPE = gql`
	mutation UpdateOrganizationalUnitType ($id: ID!, $name: String!, $description: String, $reportingUnit: Boolean!) {
		updateOrganizationalUnitType(id: $id, name: $name, description: $description, reportingUnit: $reportingUnit) {
			id
		}
	}
`;

export const DELETE_OU_TYPE = gql`
	mutation DeleteOrganizationalUnitType ($id: ID!) {
		deleteOrganizationalUnitType(id: $id) {
			id
		}
	}
`;