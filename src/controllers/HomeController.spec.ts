import request from 'supertest';

import App from 'routes';


describe('HomeControllers', () => {
  it('should return Healthcheck message', async () => {
    const response = await request(App).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Health check!' });
  });
});