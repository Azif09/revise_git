import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findByEmailOrPhone,
  createUser,
} from "../domain/repositories/IUserRepository.js";

export async function createCustomer(data) {
  const findCustomerByEmailOrPhone = findByEmailOrPhone(
    data.email,
    data.password
  );

  console.log(
    `findCustomerByEmailOrPhone - ${JSON.stringify(findCustomerByEmailOrPhone)}`
  );

  const hashedPass = await bcrypt.hash(data.password, 10);

  const customerData = {
    name: data.name,
    email: data.email,
    phone: data.countryCode + data.phone,
    password: hashedPass,
  };

  return createUser(customerData);
}
