import { Bug } from '.'
import { User } from '../user'

let user, bug

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  bug = await Bug.create({ user, name: 'test', description: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = bug.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(bug.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.name).toBe(bug.name)
    expect(view.description).toBe(bug.description)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = bug.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(bug.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.name).toBe(bug.name)
    expect(view.description).toBe(bug.description)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
