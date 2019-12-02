import { ForbiddenError } from 'apollo-server'

async function businessRoleByOu(parent, {where}, ctx, info) {
    let organizationalUnitIds = [where.id]
    let parent1 = await ctx.prisma.organizationalUnit(where).parent()
    let parent2 = await ctx.prisma.organizationalUnit(where).parent().parent()
    if(parent1){organizationalUnitIds.push(parent1.id)}
    if(parent2){organizationalUnitIds.push(parent2.id)}

    let businessRoles = await ctx.prisma.businessRoles( { where: { 
        organizationalUnit: { 
            id_in: organizationalUnitIds 
        }
    } } )

	return businessRoles
}

async function createOrganizationalUnit(parent, {data}, ctx, info) {
    const rootNodes = await ctx.prisma.organizationalUnits({ where: { parent: null } })
    const rootCount = rootNodes.length

	if (rootCount > 0) {
		throw new ForbiddenError(`There can be only one root organizational unit`);
	}

	const organizationalUnit = await ctx.prisma.createOrganizationalUnit({...data}, info);
	return organizationalUnit;
}

async function getRootOu(parent, {data}, ctx, info) {
    return await ctx.prisma.organizationalUnits({ where: { parent: null } })
}

module.exports = {
    businessRoleByOu, 
    createOrganizationalUnit, 
    getRootOu};