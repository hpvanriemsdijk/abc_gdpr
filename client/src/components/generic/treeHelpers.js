/*
 *  ownKey: The leaf ownKey will be highlighted as current leaf
 *  parentTree: if true, 3rd level will be disabled. if false 3rd level will be selecable
 * 
 * Take tree object and 
 * - Disable the own key (if ownKey is set)
 * - Remove everything deeper than 2 levels of nesting (3 levels, if parentTree is true)
 * - Prevent creating a loop --> cant select childeren in own tree
 * - Disable options that will lead to nesting deeper than 3 levels
 */
export const prepOptionsTree = (obj, ownKey = null, parentTree = false) => {
  var disableLine = false;
  var ownDepth = 0;

  //Get childeren depth of ownKey
  if(ownKey){
    obj.forEach(function(itemsL1) {  
      if(itemsL1.value === ownKey){
        ownDepth = getDepth(itemsL1);
      }else{
        if(itemsL1.children) itemsL1.children.forEach(function(itemsL2){
          if(itemsL2.value === ownKey) ownDepth = getDepth(itemsL2);
        })
      }
    })
  }

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
        parentTree ? itemsL3.disabled = true : itemsL3.disabled = false;
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

export const orderBranch = obj => { 
  var tmp = {id: obj.id, name: obj.name, child: [], current: true }

  //Order childeren
  if(obj.children) obj.children.forEach(function(itemsL2, i){
    tmp.child[i] = {id: itemsL2.id, name: itemsL2.name, child: []};
    if(itemsL2.children) itemsL2.children.forEach(function(itemsL3, y){
      tmp.child[i].child[y] = {id: itemsL3.id, name: itemsL3.name, child: []};
    })
  })

  //Order Parents
  if(obj.parent){
    tmp = {id: obj.parent.id, name: obj.parent.name, child: [tmp] }
    if(obj.parent.parent){
      tmp = {id: obj.parent.parent.id, name: obj.parent.parent.name, child: [tmp] }
    }      
  }

  return tmp
};

export const orderParents = obj => { 
  var tmp = {id: obj.id, name: obj.name, child: null, current: true }
  
  //Order Parents
  if(obj.parent){
    tmp = {id: obj.parent.id, name: obj.parent.name, child: tmp }
    if(obj.parent.parent){
      tmp = {id: obj.parent.parent.id, name: obj.parent.parent.name, child: tmp }
    }      
  }

  return tmp
};