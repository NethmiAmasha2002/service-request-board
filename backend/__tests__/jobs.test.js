const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const JobRequest = require("../models/JobRequest");


jest.setTimeout(30000);

let authToken = "";

beforeAll(async () => {
  
  let attempts = 0;
  while (mongoose.connection.readyState !== 1 && attempts < 20) {
    await new Promise((r) => setTimeout(r, 500));
    attempts++;
  }

  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB did not connect in time");
  }

  // Register a test user to get a JWT token for protected routes
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Jest User", email: "jest_test@test.com", password: "password123" });

  if (res.status === 201) {
    authToken = res.body.token;
  } else {
    // Already exists from a previous run — log in instead
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "jest_test@test.com", password: "password123" });
    authToken = login.body.token;
  }
});

// Wipe jobs between every test 
afterEach(async () => {
  await JobRequest.deleteMany({});
});

afterAll(async () => {
  // Clean up the test user we created
  await mongoose.connection.collection("users").deleteOne({ email: "jest_test@test.com" });
});

// Attaches the JWT token to any request
function withAuth(req) {
  return req.set("Authorization", `Bearer ${authToken}`);
}


describe("GET /api/jobs", () => {
  it("returns an empty array when no jobs exist", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("returns all jobs", async () => {
    await JobRequest.create([
      { title: "Fix tap",    description: "Leaking tap",   category: "Plumbing" },
      { title: "Paint wall", description: "Need painting", category: "Painting" },
    ]);
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("filters by category", async () => {
    await JobRequest.create([
      { title: "Fix tap",    description: "Leaking tap",   category: "Plumbing" },
      { title: "Paint wall", description: "Need painting", category: "Painting" },
    ]);
    const res = await request(app).get("/api/jobs?category=Plumbing");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe("Plumbing");
  });

  it("filters by status", async () => {
    await JobRequest.create([
      { title: "Job A", description: "Open job",   status: "Open"   },
      { title: "Job B", description: "Closed job", status: "Closed" },
    ]);
    const res = await request(app).get("/api/jobs?status=Open");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe("Open");
  });
});


describe("POST /api/jobs", () => {
  it("creates a new job with valid data", async () => {
    const payload = {
      title:        "Leaking pipe",
      description:  "Pipe under sink is dripping",
      category:     "Plumbing",
      location:     "Colombo",
      contactName:  "Nimal Silva",
      contactEmail: "nimal@example.com",
    };
    const res = await withAuth(request(app).post("/api/jobs")).send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.status).toBe("Open");
  });

  it("returns 400 when title is missing", async () => {
    const res = await withAuth(request(app).post("/api/jobs"))
      .send({ description: "Some description" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when description is missing", async () => {
    const res = await withAuth(request(app).post("/api/jobs"))
      .send({ title: "Some title" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await withAuth(request(app).post("/api/jobs")).send({
      title:        "Test job",
      description:  "Test description",
      contactEmail: "not-an-email",
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});


describe("PATCH /api/jobs/:id", () => {
  it("updates job status successfully", async () => {
    const job = await JobRequest.create({ title: "Fix tap", description: "Dripping tap" });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "In Progress" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("In Progress");
  });

  it("returns 400 for invalid status value", async () => {
    const job = await JobRequest.create({ title: "Fix tap", description: "Dripping tap" });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "InvalidStatus" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: "Closed" });
    expect(res.status).toBe(404);
  });
});


describe("DELETE /api/jobs/:id", () => {
  it("deletes an existing job", async () => {
    const job = await JobRequest.create({ title: "Fix tap", description: "Dripping tap" });
    const res = await withAuth(request(app).delete(`/api/jobs/${job._id}`));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await JobRequest.findById(job._id);
    expect(found).toBeNull();
  });

  it("returns 404 when deleting non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await withAuth(request(app).delete(`/api/jobs/${fakeId}`));
    expect(res.status).toBe(404);
  });
});