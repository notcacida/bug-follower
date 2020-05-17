import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { USER_ROLES } from '../../constants'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Bug, { schema } from './model'

const router = new Router()
const { name, description } = schema.tree

/**
 * @api {post} /bugs Create bug
 * @apiName CreateBug
 * @apiGroup Bug
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Bug's name.
 * @apiParam description Bug's description.
 * @apiSuccess {Object} bug Bug's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Bug not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true, roles: [USER_ROLES.TESTER] }),
  body({ name, description }),
  create)

/**
 * @api {get} /bugs Retrieve bugs
 * @apiName RetrieveBugs
 * @apiGroup Bug
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} bugs List of bugs.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /bugs/:id Retrieve bug
 * @apiName RetrieveBug
 * @apiGroup Bug
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} bug Bug's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Bug not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /bugs/:id Update bug
 * @apiName UpdateBug
 * @apiGroup Bug
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Bug's name.
 * @apiParam description Bug's description.
 * @apiSuccess {Object} bug Bug's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Bug not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, description }),
  update)

/**
 * @api {delete} /bugs/:id Delete bug
 * @apiName DeleteBug
 * @apiGroup Bug
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Bug not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true, roles: [USER_ROLES.DEVELOPER] }),
  destroy)

export default router
