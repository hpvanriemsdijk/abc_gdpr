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
    businessRoleByOu};