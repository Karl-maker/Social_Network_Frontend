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
      name: "NotFound",
      message: "No account created with that email",
    };
  }

  const validate = await user.isValidPassword(password);

  if (!validate) {
    throw {
      name: "Unauthorized",
      message: "Email or Password is not correct",
    };
  }

  return user;
};

export default { login };
