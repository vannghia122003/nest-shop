import { CreatePermissionDto } from '../../../permission/dto/create-permission.dto'

const permissionsData: CreatePermissionDto[] = [
  { path: '/roles', module: 'roles', method: 'GET', description: 'Fetch list role' },
  { path: '/roles', module: 'roles', method: 'POST', description: 'Create role' },
  { path: '/roles/:id', module: 'roles', method: 'GET', description: 'Fetch role detail' },
  { path: '/roles/:id', module: 'roles', method: 'PATCH', description: 'Update role' },
  { path: '/roles/:id', module: 'roles', method: 'DELETE', description: 'Delete role' },

  {
    path: '/permissions',
    module: 'permissions',
    method: 'GET',
    description: 'Fetch list permission'
  },
  { path: '/permissions', module: 'permissions', method: 'POST', description: 'Create permission' },
  {
    path: '/permissions/:id',
    module: 'permissions',
    method: 'GET',
    description: 'Fetch permission detail'
  },
  {
    path: '/permissions/:id',
    module: 'permissions',
    method: 'PATCH',
    description: 'Update permission'
  },
  {
    path: '/permissions/:id',
    module: 'permissions',
    method: 'DELETE',
    description: 'Delete permission'
  },

  { path: '/users', module: 'users', method: 'GET', description: 'Fetch list user' },
  { path: '/users', module: 'users', method: 'POST', description: 'Create user' },
  { path: '/users/:id', module: 'users', method: 'GET', description: 'Fetch user detail' },
  { path: '/users/:id', module: 'users', method: 'PATCH', description: 'Update user' },
  { path: '/users/:id', module: 'users', method: 'DELETE', description: 'Delete user' },

  { path: '/categories', module: 'categories', method: 'GET', description: 'Fetch list category' },
  { path: '/categories', module: 'categories', method: 'POST', description: 'Create category' },
  {
    path: '/categories/:id',
    module: 'categories',
    method: 'GET',
    description: 'Fetch category detail'
  },
  {
    path: '/categories/:id',
    module: 'categories',
    method: 'PATCH',
    description: 'Update category'
  },
  {
    path: '/categories/:id',
    module: 'categories',
    method: 'DELETE',
    description: 'Delete category'
  },

  { path: '/products', module: 'products', method: 'GET', description: 'Fetch list product' },
  { path: '/products', module: 'products', method: 'POST', description: 'Create product' },
  { path: '/products/:id', module: 'products', method: 'GET', description: 'Fetch product detail' },
  { path: '/products/:id', module: 'products', method: 'PATCH', description: 'Update product' },
  { path: '/products/:id', module: 'products', method: 'DELETE', description: 'Delete product' },

  {
    path: '/products/:productId/reviews',
    module: 'products',
    method: 'GET',
    description: 'Fetch list review'
  },
  {
    path: '/products/:productId/reviews',
    module: 'products',
    method: 'POST',
    description: 'Create review'
  },

  { path: '/posts', module: 'posts', method: 'GET', description: 'Fetch list post' },
  { path: '/posts', module: 'posts', method: 'POST', description: 'Create post' },
  { path: '/posts/:id', module: 'posts', method: 'GET', description: 'Fetch post detail' },
  { path: '/posts/:id', module: 'posts', method: 'PATCH', description: 'Update post' },
  { path: '/posts/:id', module: 'posts', method: 'DELETE', description: 'Delete post' },

  { path: '/tags', module: 'tags', method: 'GET', description: 'Fetch list tag' },
  { path: '/tags', module: 'tags', method: 'POST', description: 'Create tag' },
  { path: '/tags/:id', module: 'tags', method: 'GET', description: 'Fetch tag detail' },
  { path: '/tags/:id', module: 'tags', method: 'PATCH', description: 'Update tag' },
  { path: '/tags/:id', module: 'tags', method: 'DELETE', description: 'Delete tag' },

  { path: '/orders', module: 'orders', method: 'GET', description: 'Fetch list order' },
  { path: '/orders', module: 'orders', method: 'POST', description: 'Create order' },
  { path: '/orders/:id', module: 'orders', method: 'GET', description: 'Fetch order detail' },
  { path: '/orders/:id', module: 'orders', method: 'PATCH', description: 'Update order' },
  { path: '/orders/:id', module: 'orders', method: 'DELETE', description: 'Delete order' },

  { path: '/cart', module: 'cart', method: 'GET', description: 'Fetch cart' },
  { path: '/cart/add-to-cart', module: 'cart', method: 'POST', description: 'Add product to cart' },
  { path: '/cart/update', module: 'cart', method: 'PUT', description: 'Update product in cart' },
  { path: '/cart/delete', module: 'cart', method: 'DELETE', description: 'Delete product in cart' }
]

export default permissionsData
