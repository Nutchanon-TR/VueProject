import { createRouter, createWebHistory } from 'vue-router'
//Register
import LoginPage from '@/views/Register/LoginPage.vue'
import SignUpPage from '@/views/Register/SignUpPage.vue'
//Professor
import HomePagePro from '@/views/Professor/HomePagePro.vue'
import CreateExamPage from '@/views/Professor/CreateExamPage.vue'
import EditExamPage from '@/views/Professor/EditExamPage.vue'
import ProfileProfessor from '@/views/Professor/ProfileProfessor.vue'
//Student
import HomePageStud from '@/views/Student/HomePageStud.vue'
import ProfileStudent from '@/views/Student/ProfileStudent.vue'
//Admin
import AdminPage from '@/views/AdminPage.vue'
//DoExam
import DoExamPage from '@/views/DoExamPage.vue'
//Manage
import Manage from '@/views/Manage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/signup',
      name: 'SignUpPage',
      component: SignUpPage,
    },
    {
      path: '/professor/home',
      name: 'HomePagePro',
      component: HomePagePro,
    },
    {
      path: '/professor/profile',
      name: 'ProfileProfessor',
      component: ProfileProfessor,
    },
    {
      path: '/professor/create',
      name: 'CreateExamPage',
      component: CreateExamPage,
    },
    {
      path: '/professor/edit/1',
      name: 'EditExamPage',
      component: EditExamPage,
    },
    {
      path: '/student/home',
      name: 'HomePageStud',
      component: HomePageStud,
    },
    {
      path: '/student/profile',
      name: 'ProfileStudent',
      component: ProfileStudent,
    },
    {
      path: '/student/exam/1',
      name: 'DoExamPage',
      component: DoExamPage,
    },
    {
      path: '/professor/exam/1',
      name: 'DoExamPage',
      component: DoExamPage,
    },
    {
      path: '/admin',
      name: 'AdminPage',
      component: AdminPage,
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
    },
  ],
})

export default router
