import faker from "faker";

import { User } from "../../../entity/User";
import { Connection } from "typeorm";
import { TestClient } from "../../../tests/utils/TestClient";
import { createTestConn } from "../../../tests/utils/createTestConn";

let userId: string;
let conn: Connection;
const email = faker.internet.email();
const password = faker.internet.password();
const client = new TestClient(process.env.TEST_HOST!);

beforeAll(async () => {
    conn = await createTestConn();
    const user = await User.create({
        email,
        password,
        confirmed: true
    }).save();
    userId = user.id;
});

afterAll(async () => {
    await conn.close();
});

describe("Me query", () => {
    test("Successfully returns null when user is not logged in", async () => {
        const response = await client.me();
        expect(response.data.data.me).toBeNull();
    });

    test("Successfully get currently logged in user", async () => {
        await client.login(email, password);

        const response = await client.me();
        expect(response.data.data).toEqual({
            me: {
                id: userId,
                email
            }
        });
    });
});
