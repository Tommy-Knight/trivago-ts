import supertest from "supertest";
import server from "../src/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import AccomodationModel from "./models/accomodation/schema.js"
dotenv.config();

const request = supertest(server);

beforeAll((done) => {
	console.log(process.env.MONGOOSE_CONNECTION);

	mongoose.connect(process.env.MONGOOSE_CONNECTION, { useNewUrlParser: true }).then(() => {
		console.log("Successfully connected to Atlas! 🍌");
		done();
	});
});

afterAll((done) => {
	mongoose.connection.dropDatabase(() => {
		mongoose.connection.close(() => {
			console.log("Closed connection to Atlas!");

			done();
		});
	});
});

describe("Stage I - Testing the test env", () => {
	it("should test that true is true", () => {
		expect(true).toBe(true);
	});

	it("should test that false is not true", () => {
		expect(false).not.toBe(true);
	});

	it("should test that false is falsy", () => {
		expect(false).toBeFalsy();
	});
});

describe("Endpoint Testing", () => {
	it("should return the full list of accomodations", async () => {
		const response = await request.get("/accomodation");
		expect(response.status).toBe(200);
		expect(response.body.accomodations).length.not.toBe(0);
		// it("returns appropriate error when no accomodations are in array")
	});
	const validAccomo = {
		name: "casaTommy",
		description: "lovely place",
		maxGuests: 6,
		city: "newyork",
	};
	const invalidAccomo = {
		name: "casaTommy",
		description: "lovely place",
		maxGuests: "7",
		city: "newyork",
	};
	const newAccomo = {
		name: "tommyhouse",
		description: "cool place",
		maxGuests: 6,
		city: "london",
	};

	it("will add new accomodation and return 201 if valid", async () => {
		const response = await request.post("/accomodation").send(validAccomo);
		expect(response.status).toBe(201);
		expect(response.body._id).toBeDefined();

		const _response = await request.get("/accomodation/" + response.body._id);
		expect(_response.body.name).toEqual(validAccomo.name);
	});

	it("will return 400 if posting invalid accomodation data", async () => {
		const response = await request.post("/accomodation").send(invalidAccomo);
		expect(response.status).toBe(400);
	});

	it("will return 404 if the accomodation id is non existing", async () => {
		const response = await request.get("/accomodation/" + 123);
		expect(response.status).toBe(404);
	});

	it("will edit an existing accomodation and return 204", async () => {
		const response = await request.post("/accomodation").send(validAccomo);
		expect(response.status).toBe(201);
		const _response = await request.put("/accomodation/" + response.body._id).send(newAccomo);
		expect(_response.status).toBe(204);
	});

	it("editing with false id will return 404 if not existing", async () => {
		const response = await request.post("/accomodation").send(validAccomo);
		expect(response.status).toBe(201);
		const _response = await request.put("/accomodation/" + 123).send(newAccomo);
		expect(_response.status).toBe(404);
	});
    it("will delete accomodation and return 204 if ok", async () => {
        	const response = await request.post("/accomodation").send(validAccomo);
					expect(response.status).toBe(201);
        const _response = await request.delete("/accomodation/" + _response.body._id);
        expect(_response.status).toBe(204)
    })
    it("deleting will retunr 404 if not existing", async () => {
		const response = await request.post("/accomodation").send(validAccomo);
		expect(response.status).toBe(201);
		const _response = await request.delete("/accomodation/" + 123)
		expect(_response.status).toBe(404);
    })
});
