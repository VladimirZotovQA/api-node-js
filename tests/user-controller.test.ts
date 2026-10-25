import {test, expect, } from '@playwright/test';
import {StatusCodes} from "http-status-codes";
let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    test('find user: should return a user by ID', async ({ request }) => {

        const createResponse = await request.post(`${baseURL}`)
        expect(createResponse.status()).toBe(StatusCodes.CREATED);
        const createdUser = await createResponse.json();

        const response = await request.get(`${baseURL}/${createdUser.id}`)

        expect(response.status()).toBe(StatusCodes.OK);
        const foundUser = await response.json();
        expect(foundUser.id).toBe(createdUser.id);
    });

    test('find user: should return 404 if user not found', async ({ request }) => {

        const nonExistingId = 101;
        const response = await request.get(`${baseURL}/${nonExistingId}`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('create user: should add a new user', async ({ request }) => {
        const createResponse = await request.post(`${baseURL}`)
        expect(createResponse.status()).toBe(StatusCodes.CREATED);
        const createdUser = await createResponse.json();

        const response = await request.get(`${baseURL}/${createdUser.id}`)

        expect(response.status()).toBe(StatusCodes.OK);
        expect(typeof createdUser.name).toBe('string');
        expect(typeof createdUser.email).toBe('string');
        expect(typeof createdUser.phone).toBe('string');
        expect(typeof createdUser.id).toBe('number');
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        const createResponse = await request.post(`${baseURL}`)
        expect(createResponse.status()).toBe(StatusCodes.CREATED);
        const createdUser = await createResponse.json();

        const response = await request.delete(`${baseURL}/${createdUser.id}`)

        expect(response.status()).toBe(StatusCodes.OK);
        const getAfterDelete = await request.get(`${baseURL}/${createdUser.id}`)
        expect(getAfterDelete.status()).toBe(StatusCodes.NOT_FOUND)
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const nonExistingId = 101;
        const response = await request.delete(`${baseURL}/${nonExistingId}`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND);
    });

});
