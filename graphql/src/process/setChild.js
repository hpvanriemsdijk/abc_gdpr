export default event => {
    //Get ID new process
    console.log(event.data)

    //Has parent?
    if(event.data.parentId != null){
        console.log("Has parent")

        //Set childID on parent to ID of created process1
    }else{
        console.log("Has no parent")
    }
    
    return event
}