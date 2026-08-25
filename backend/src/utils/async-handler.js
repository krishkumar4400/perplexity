const asyncHandler = (requestHandler) => {
  return (res, res, next) => {
    Promise.resolve(requestHandler(req,res,next)).catch((error) => {
      next(error);
    });
  };
};

export default asyncHandler;
