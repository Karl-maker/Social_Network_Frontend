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

async function getOneById(user_id) {
  let profile;

  try {
    profile = await Profile.aggregate([
      {
        $match: { user_id },
      },
      {
        $addFields: {
          user_id: { $toObjectId: "$user_id" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                username: 1,
                createdAt: 1,
                email: 1,
              },
            },
          ],
        },
      },
    ]);
  } catch (err) {
    throw new Error(err);
  }

  return profile;
}

export default { create, getOneById };
