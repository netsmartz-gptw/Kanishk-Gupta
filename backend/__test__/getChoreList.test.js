const app = require("../src/app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const token = require('../src/helpers/acessTokenHandler')
const { default: mongoose } = require('mongoose');
const childuid = process.env.JEST_CHILD_UID

let accesstoken;

beforeAll(async () => {
    accesstoken = await token()
});

describe("get chore list test cases", () => {

    test("should response 403 when accessed with parent token", async () => {
        const response = await request.get("/chores/list").set({ accesstoken })
        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('statusCode')
        expect(response.body).toHaveProperty('response')
        expect(response.body.response).toHaveProperty('message')
    })

    // TODO: /chores/list endpoint should return chores or blank array should not retur 400, uncomment these case once this is fixed
    //  test("fetch child chores list", async () => {
    //     const response =  await request.get("/chores/list").set({accesstoken, childuid})
    //     expect(response.statusCode).toBe(200)
    //     expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    //     expect(response.body).toHaveProperty('response')
    //     expect(response.body.response).toHaveProperty('filteredItems')
    // })

    //     test("fetch child chores list if any one day chore is completed", async () => {
    //         const response =  await request.get("/chores/list").set({accesstoken, childuid}).query({completed:true})
    //         expect(response.statusCode).toBe(200)
    //         expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    //         expect(response.body).toHaveProperty('response')
    //         expect(response.body.response).toHaveProperty('filteredItems')
    //     })

    //     test("when access token is missing", async () => {
    //         const response =  await request.get("/chores/list").set({accesstoken, childuid})
    //         expect(response.statusCode).toBe(400)
    //         expect(response.body).toHaveProperty('response')
    //         expect(response.body.response).toHaveProperty('message')
    //    })    
})

afterAll(() => mongoose.connection.close());
