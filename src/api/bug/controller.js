import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Bug } from '.'
import {USER_ROLES} from '../../constants'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Bug.create({ ...body, user })
    .then((bug) => bug.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Bug.find(query, select, cursor)
    .populate('user')
    .then((bugs) => bugs.map((bug) => bug.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Bug.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((bug) => bug ? bug.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Bug.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((bug) => bug ? Object.assign(bug, body).save() : null)
    .then((bug) => bug ? bug.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Bug.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, USER_ROLES.DEVELOPER))
    .then((bug) => bug ? bug.remove() : null)
    .then(success(res, 204))
    .catch(next)
