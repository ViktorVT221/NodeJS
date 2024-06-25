const request = require('supertest');
const app = require('../../Lab3-4-5/TaskApp/src/app');
const User = require('../../Lab3-4-5/TaskApp/models/user');
const Task = require('../../Lab3-4-5/TaskApp/models/task');
require('../../Lab3-4-5/TaskApp/db/mongoose');
require('dotenv').config({ path: '../../Lab3-4-5/.env' });

(async () => {
    const { expect } = await import('chai');

    describe('TaskApp API tests', function() {
        let authToken;

        before(async function() {
            await User.deleteMany({});
            await Task.deleteMany({});
        });

        it('Реєстрація користувача User1 з помилкою валідації', async function() {
            const res = await request(app)
                .post('/users')
                .send({ name: 'User1', password: '12345', email: 'invalid-email' });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
        });

        it('Реєстрація користувача User1 без помилок', async function() {
            const res = await request(app)
                .post('/users')
                .send({ name: 'User1', age: 20, password: '12345678', email: 'user1@gmail.com' });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('name', 'User1');
            expect(res.body).to.have.property('email', 'user1@gmail.com');
        });

        it('Реєстрація користувача User2 без помилок', async function() {
            const res = await request(app)
                .post('/users')
                .send({ name: 'User2', age: 22, password: '12345678', email: 'user2@gmail.com' });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('name', 'User2');
            expect(res.body).to.have.property('email', 'user2@gmail.com');
        });

        it('Вхід під User1 з вірними даними', async function() {
            const res = await request(app)
                .post('/users/login')
                .send({ email: 'user1@gmail.com', password: '12345678' });

            expect(res.status).to.equal(202);
            expect(res.body).to.have.property('token');
            authToken = res.body.token;
        });

        it('Додавання задачі Task1', async function() {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task1', description: 'First task', completed: false });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('title', 'Task1');
            expect(res.body).to.have.property('description', 'First task');
            expect(res.body).to.have.property('completed', false);
        });

        it('Додавання задачі Task2', async function() {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task2', description: 'Second task', completed: false });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('title', 'Task2');
            expect(res.body).to.have.property('description', 'Second task');
            expect(res.body).to.have.property('completed', false);
        });

        it('Отримання задач користувача User1', async function() {
            const res = await request(app)
                .get('/tasks')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.have.property('title');
            expect(res.body[1]).to.have.property('title');
        });

        it('Отримання задачі Task1 по ідентифікатору', async function() {
            const taskRes = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task1', description: 'First task', completed: false });

            const res = await request(app)
                .get(`/tasks/${taskRes.body._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('title', 'Task1');
            expect(res.body).to.have.property('completed', false);
        });

        it('Вихід User1', async function() {
            const res = await request(app)
                .post('/users/logout')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(202);
            expect(res.body).to.have.property('message', 'logout success');
        });

        it('Вхід під User2 з вірними даними', async function() {
            const res = await request(app)
                .post('/users/login')
                .send({ email: 'user2@gmail.com', password: '12345678' });

            expect(res.status).to.equal(202);
            expect(res.body).to.have.property('token');
            authToken = res.body.token;
        });

        it('Додавання задачі Task3', async function() {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task3', description: 'Third task', completed: false });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('title', 'Task3');
            expect(res.body).to.have.property('description', 'Third task');
            expect(res.body).to.have.property('completed', false);
        });

        it('Отримання задач користувача User2', async function() {
            const res = await request(app)
                .get('/tasks')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.length(1);
            expect(res.body[0]).to.have.property('title', 'Task3');
        });

        it('Отримання задачі Task1 по ідентифікатору з User2', async function() {
            const taskRes = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task1', description: 'First task', completed: false });

            const res = await request(app)
                .get(`/tasks/${taskRes.body._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message', 'Not Found');
        });

        it('Вихід User2', async function() {
            const res = await request(app)
                .post('/users/logout')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(202);
            expect(res.body).to.have.property('message', 'logout success');
        });

        it('Отримання задачі Task1 по її ідентифікатору після виходу', async function() {
            const taskRes = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task1', description: 'First task', completed: false });

            const res = await request(app)
                .get(`/tasks/${taskRes.body._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('message', 'Forbidden Access');
        });
    });
})();
