/*
  * Take an optionsdata object to 
  * - Disable the own key
  * - Remove everything deeper than 2 levels of nesting (3 levels)
  * - Prevent creating a loop --> cant select childeren in own tree
  * TODO
  * - Disable options that will lead to nesting deeper than 3 levels
  * 
  * childDepth eigen 
  * 
  */
const prepOptionsTree = (obj, ownKey = null) => {
  var disableLine = false;
  var ownDepth = 0;

  //Get childeren depth of ownKey
  obj.forEach(function(itemsL1) {  
    if(itemsL1.value === ownKey){
      ownDepth = getDepth(itemsL1);
    }else{
      if(itemsL1.children) itemsL1.children.forEach(function(itemsL2){
        if(itemsL2.value === ownKey) ownDepth = getDepth(itemsL2);
      })
    }
  })

  //Set not allowed options to disabled
  obj.forEach(function(itemsL1) {      
    itemsL1.value === ownKey || ownDepth > 2
      ? itemsL1.disabled = disableLine = true 
      : itemsL1.disabled = disableLine = false; 
    if(itemsL1.children) itemsL1.children.forEach(function(itemsL2){
      itemsL2.value === ownKey || disableLine || ownDepth > 1
        ? itemsL2.disabled = true 
        : itemsL2.disabled = false 
      if(itemsL2.children) itemsL2.children.forEach(function(itemsL3){
        itemsL3.disabled = true 
        if(itemsL3.children) itemsL3.children = null 
      })
    })
  });

  return obj
};

const getDepth = (obj) => {
  var depth = 0;
  if (obj.children) {
      obj.children.forEach(function (d) {
          var tmpDepth = getDepth(d)
          if (tmpDepth > depth) {
              depth = tmpDepth
          }
      })
  }
  return 1 + depth
}

export { prepOptionsTree };