jest.mock('uuidv4',()=>{
return {
    generate : jest.fn().mockImplementation((value) =>{
        return Buffer.from(value, 'base64').toString();
    })
}
})