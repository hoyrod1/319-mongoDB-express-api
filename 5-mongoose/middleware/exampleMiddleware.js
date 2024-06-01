module.exports = {
  middleware,
};
// Will fire off after every call to a route
async function middleware(req, res, next) {
  const yourCool = true;

  if (yourCool) {
    next();
  } else {
    res.status(400).send("Bad Request");
  }
}
