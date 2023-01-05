const errorHandler = async (request,response,next) => {
  try {
    throw new Error(`processing error in request `)
  } catch(error) {
    next(error)
  }  
}