import User from "../model/user";

const login = async ({ email, password }) => {
  let user = {};

  user = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: email.toLowerCase() }],
  }).select({
    password: 1,
    email: 1,
    username: 1,
    account_type: 1,
    is_confirmed: 1,
  });

  if (!user) {
    throw {
      status: 404,
      name: "NotFound",
      message: "You have entered an invalid username, email or password",
    };
  }

  const validate = await user.isValidPassword(password);

  if (!validate) {
    throw {
      status: 404,
      name: "NotFound",
      message: "You have entered an invalid username, email or password",
    };
  }

  return user;
};

export default { login };
