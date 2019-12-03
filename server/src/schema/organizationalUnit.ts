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
    const newRoot = (((data || {}).parent || {}).connect || {}).id;

	if (rootCount > 0 && !newRoot) {
		throw new ForbiddenError(`There can be only one root organizational unit`);
	}

	return await ctx.prisma.createOrganizationalUnit({...data}, info);
}

async function deleteOrganizationalUnit(parent, args ,ctx, info){
    const id = args.where.id;
    const parent1 = await ctx.prisma.organizationalUnits({ where: { id } }).parent();
    if(!parent1[0].parent) throw new ForbiddenError('You can not delete the root organizational unit.');
    
    return await ctx.prisma.deleteOrganizationalUnit({ id }, info);
}

async function getRootOu(parent, {data}, ctx, info) {
    return await ctx.prisma.organizationalUnits({ where: { parent: null } })
}

module.exports = {
    businessRoleByOu, 
    createOrganizationalUnit, 
    deleteOrganizationalUnit,
    getRootOu};