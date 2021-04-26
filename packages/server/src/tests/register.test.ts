import { request } from "graphql-request";
import { createConnection } from "typeorm";
import { User } from "../entity/User";
import { HOST } from "./constants";

const email = "testing@testing.com";
const password = "password123";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register user", async () => {
    const response = await request(HOST, mutation);
    expect(response).toEqual({ register: true });
    await createConnection();

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
});
