


import request from 'supertest';
import express from 'express';
import userRouter from '../routes/userRoutes';

const app = express();
app.use(express.json());

app.use('/users',userRouter)

describe('User Controllers', () => {
  let testUserID: string;

  test('should register a user', async () => {
    const response = await request(app)
      .post('/users/register') 
      .send({
        fullName: 'John Doe',
        email: 'john.doe@thejitu.com',
        password: 'secpassword123',
        cohortNumber: '17',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User Registered Successfully');
    testUserID = response.body.userID;
  });

  test('should edit a user', async () => {
    const response = await request(app)
      .put(`/users/edit/${testUserID}`)
      .send({
        fullName: 'Updated Name',
        cohortNumber: 'UpdatedCohort',
        password: 'mynewPassword123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User updated successfully');
  });

  test('should login a user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'john.doe@thejitu.com',
        password: 'myecuredpassword123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Logged in successfully');
    expect(response.body).toHaveProperty('token');
  });

  test('should get all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200); 
    expect(response.body).toBeInstanceOf(Array);
  });

  test('should get user details', async () => {
    const response = await request(app).get(`/users/details/${testUserID}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userID', testUserID);
  });

  test('should check user credentials', async () => {
    const response = await request(app).get('/users/checkUserDetails');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('info');
  });

  test('should delete a user', async () => {
    const response = await request(app).delete(`/users/delete/${testUserID}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted successfully');
  });

  afterAll(async () => {
  });
});
