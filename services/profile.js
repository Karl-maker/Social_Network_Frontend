import Profile from "../model/profile";

async function create(user_id, { details }) {
  let profile;

  const { bio, display_name } = details;

  try {
    if (await Profile.exists({ user_id })) {
      throw { name: "Forbidden", message: "Already have a profile" };
    }
    profile = await Profile.create({
      user_id,
      bio: bio || "",
      display_name: display_name || "",
    });
  } catch (err) {
    throw err;
  }

  return profile;
}

export default { create };
