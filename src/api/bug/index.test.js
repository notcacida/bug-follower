import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Bug } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, bug

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  bug = await Bug.create({ user })
})

test('POST /bugs 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, name: 'test', description: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.description).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /bugs 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /bugs 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /bugs 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /bugs/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${bug.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(bug.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /bugs/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${bug.id}`)
  expect(status).toBe(401)
})

test('GET /bugs/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /bugs/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${bug.id}`)
    .send({ access_token: userSession, name: 'test', description: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(bug.id)
  expect(body.name).toEqual('test')
  expect(body.description).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /bugs/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${bug.id}`)
    .send({ access_token: anotherSession, name: 'test', description: 'test' })
  expect(status).toBe(401)
})

test('PUT /bugs/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${bug.id}`)
  expect(status).toBe(401)
})

test('PUT /bugs/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, name: 'test', description: 'test' })
  expect(status).toBe(404)
})

test('DELETE /bugs/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${bug.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /bugs/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${bug.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /bugs/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${bug.id}`)
  expect(status).toBe(401)
})

test('DELETE /bugs/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
