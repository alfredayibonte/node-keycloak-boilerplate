import express from 'express'
import request from 'supertest'

import ProfileController from './ProfileController';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: any, res, next) => {
  req.authenticated = req.headers.authenticated === 'true';
  req.isAuthenticated = jest.fn(() => req.authenticated);
  req.user = req.authenticated ? { id: 1, name: 'Test User' } : null;
  next();
});

app.get('/profile', ProfileController.index)

describe('ProfileController', ()=> {
  it('should redirect to /login if not authenticated', async () => {
    const response = await request(app).get('/profile');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
});

it('should return user data if authenticated', async () => {
    const response = await request(app)
        .get('/profile')
        .set({'authenticated': 'true'});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: 1, name: 'Test User' } });
});
})