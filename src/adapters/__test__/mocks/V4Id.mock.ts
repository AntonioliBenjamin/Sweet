jest.mock('uuid',()=>{
return {
    v4 : jest.fn().mockImplementation(() =>{
        return "Hello World";
    })
}
})