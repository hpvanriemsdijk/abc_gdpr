async function processingActivitiesByOu(parent, {data, where}, ctx, info) {
  // organizationalUnit --> [children] --> [processes] --> [processingActivities] 
  // Get all OU ID's down the tree 
  let organizationalUnitIds = [where.id]
  let children1 = await ctx.prisma.organizationalUnit(where).children()
  let children2 = await ctx.prisma.organizationalUnit(where).children().children()
  let children = children1.concat(children2)
  if(children.length){
    children.forEach(function (child) {
      if(child.id){organizationalUnitIds.push(child.id)}
    })
  }

  // Get processingActivities via processes
  let processingActivities = await ctx.prisma.processes( { where: { 
    organizationalUnit: { 
        id_in: organizationalUnitIds 
    }
  } } ).processingActivities()

  //Flatten de array to remove process grouping
  let flattenActivities = []
  processingActivities.forEach(function (processingActivity) {
    if(processingActivity.processingActivities.length){
      flattenActivities.push(...processingActivity.processingActivities)
    }
  })

	return flattenActivities
}

module.exports = {processingActivitiesByOu};