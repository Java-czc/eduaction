import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'ios-home-outline'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/user',
    name: 'users',
    meta: {
      title: '用户信息管理',
      icon: 'md-person',
      access: ['admin']
    },
    component: Main,
    children: [{
      path: 'user',
      name: 'users',
      meta: {
        icon: 'md-person',
        title: '用户信息管理',
      },
      component: () => import('@/view/admin/admin.vue')
    }]
  }, {
    path: '/admin',
    name: 'admin',
    meta: {
      title: '学生信息管理',
      icon: 'md-contacts',
      access: ['admin']
    },
    component: Main,
    children: [{
      path: 'admin',
      name: 'admin',
      meta: {
        icon: 'md-contacts',
        title: '学生信息管理'
      },
      component: () => import('@/view/student/student.vue')
    }]
  }, {
    path: '/teacher',
    name: 'teacher',
    meta: {
      title: '教师信息管理',
      icon: 'ios-people',
      access: ['admin']
    },
    component: Main,
    children: [{
      path: 'teacher',
      name: 'teacher',
      meta: {
        icon: 'ios-people',
        title: '教师信息管理'
      },
      component: () => import('@/view/teacher/teacher.vue')
    }]
  }, {
    path: '/course',
    name: 'course',
    meta: {
      title: '课程信息管理',
      icon: 'md-book',
      access: ['admin']
    },
    component: Main,
    children: [{
      path: 'course',
      name: 'course',
      meta: {
        icon: 'md-book',
        title: '课程信息管理'
      },
      component: () => import('@/view/course/course.vue')
    }]
  },
  {
    path: '/courseSelection',
    name: 'courseSelection',
    meta: {
      title: '选课信息管理',
      icon: 'md-clipboard',
      access: ['student']
    },
    component: Main,
    children: [{
      path: 'courseSelection',
      name: 'courseSelection',
      meta: {
        icon: 'md-clipboard',
        title: '选课信息管理'
      },
      component: () => import('@/view/courseSelection/SelectionInfo.vue')
    }]
  },
  {
    path: '/SelectionInfo',
    name: 'SelectionInfo',
    meta: {
      title: '选课信息管理',
      icon: 'md-clipboard',
      access: ['admin', 'teacher']
    },
    component: Main,
    children: [{
      path: 'SelectionInfo',
      name: 'SelectionInfo',
      meta: {
        icon: 'md-clipboard',
        title: '选课记录'
      },
      component: () => import('@/view/courseSelection/courseSelection.vue')
    }]
  },
  {
    path: '/schedule',
    name: 'schedule',
    meta: {
      title: '课表管理',
      icon: 'md-grid'
    },
    component: Main,
    children: [{
      path: 'schedule',
      name: 'schedule',
      meta: {
        icon: 'md-grid',
        title: '课表管理'
      },
      component: () => import('@/view/schedule/schedule.vue')
    }]
  }, {
    path: '/teachingTasks',
    name: 'teachingTasks',
    meta: {
      title: '教学任务管理',
      icon: 'md-alarm',
      access: ['teacher']
    },
    component: Main,
    children: [{
      path: 'teachingTasks',
      name: 'teachingTasks',
      meta: {
        icon: 'md-alarm',
        title: '教学任务管理',
      },
      component: () => import('@/view/teachingTasks/teachingTasks.vue')
    }]
  },
  {
    path: '/adminTasks',
    name: 'adminTasks',
    meta: {
      title: '教学任务管理',
      icon: 'md-alarm',
      access: ['admin']
    },
    component: Main,
    children: [{
      path: 'adminTasks',
      name: 'adminTasks',
      meta: {
        icon: 'md-alarm',
        title: '教学任务管理'
      },
      component: () => import('@/view/teachingTasks/adminTasks.vue')
    }]
  },
  {
    path: '/grade',
    name: 'grade',
    meta: {
      title: '学生成绩管理',
      icon: 'ios-list-box-outline',
      access: ['teacher']
    },
    component: Main,
    children: [{
      path: 'grade',
      name: 'grade',
      meta: {
        icon: 'ios-list-box-outline',
        title: '学生成绩管理'
      },
      component: () => import('@/view/grade/grade.vue')
    }]
  },
  {
    path: '/Stugrade',
    name: 'Stugrade',
    meta: {
      title: '学生成绩管理',
      icon: 'ios-list-box-outline',
      access: ['student', 'admin']
    },
    component: Main,
    children: [{
      path: 'Stugrade',
      name: 'Stugrade',
      meta: {
        icon: 'ios-list-box-outline',
        title: '成绩查看'
      },
      component: () => import('@/view/grade/Stugrade.vue')
    }]
  },
  {
    path: '/info',
    name: 'info',
    meta: {
      title: '个人信息',
      icon: 'ios-contact'
    },
    component: Main,
    children: [{
      path: '/myinfo',
      name: 'myinfo',
      meta: {
        title: '个人信息',
        icon: 'ios-contact'
      },
      component: () => import('@/view/myinfo/myinfo.vue')
    }, {
      path: '/upPass',
      name: 'upPass',
      meta: {
        title: '修改密码',
        icon: 'ios-settings'
      },
      component: () => import('@/view/myinfo/upPass.vue')
    }]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
