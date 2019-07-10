/*
 * When optional relation is ommited, nullify to prefent error
 */
async function createOrganizationalUnit(parent, {data, where}, ctx, info) {
    if( !data.parent.connect.id ){ delete data.parent; } 
	return await ctx.prisma.createOrganizationalUnit({...data}, info);
}

async function updateOrganizationalUnit(parent, {data, where}, ctx) {
    if( !data.parent.connect.id ){ delete data.parent; } 
	return await ctx.prisma.updateOrganizationalUnit({data: {...data}, where: {...where}});
}

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

module.exports = {
    createOrganizationalUnit, 
    updateOrganizationalUnit, 
    businessRoleByOu};