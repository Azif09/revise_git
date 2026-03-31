import { Op } from "sequelize";
import { User } from "../../model/user.model.js";

export function findByEmailOrPhone(email, phone) {
  return User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
  });
}
export function createUser(data) {
  return User.create(data);
}
