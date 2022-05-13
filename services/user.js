import { containsSpecialChars } from "../util/string";
import User from "../model/user";
import ProfileService from "./profile";

async function createUsername(username, id) {
  // Validation

  if (containsSpecialChars(username)) {
    throw {
      name: "Validation",
      message:
        "No Special Characters or spaces, Only underscores ( _ ) and dots ( . ) are allowed.",
    };
  }

  username = username.toLowerCase();
  let user, profile;
  try {
    if (!(await User.exists({ username }))) {
      user = await User.findByIdAndUpdate(
        { _id: id },
        { username },
        {
          runValidators: true,
          context: "query",
          new: true,
        }
      );

      profile = await ProfileService.create(id, {
        details: { bio: "", display_name: "" },
      });
    } else {
      throw { name: "Forbidden", message: "Username already taken" };
    }
  } catch (err) {
    throw err;
  }

  return user;
}

export default { createUsername };
