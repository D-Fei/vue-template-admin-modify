import Layout from '@/layout'

const example = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/user',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/show/user'),
        meta: { title: 'user', icon: 'table' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/show/role'),
        meta: { title: 'role', icon: 'table' }
      },
      {
        path: 'show',
        name: 'show',
        component: () => import('@/views/show/show'),
        meta: { title: 'show', icon: 'table' }
      }
    ]
  },
]

export default example