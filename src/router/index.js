import { createRouter, createWebHistory } from "vue-router";
import { onMounted, ref } from "vue";
import { getDataById, getAllData } from "@/libs/apiData.js";

//Register
import LoginPage from "@/views/Register/LoginPage.vue";
import SignUpPage from "@/views/Register/SignUpPage.vue";
//Professor
import HomePagePro from "@/views/Professor/HomePagePro.vue";
import CreateExamPage from "@/views/Professor/CreateExamPage.vue";
import EditExamPage from "@/views/Professor/EditExamPage.vue";
import ProfileProfessor from "@/views/Professor/ProfileProfessor.vue";
//Student
import HomePageStud from "@/views/Student/HomePageStud.vue";
import ProfileStudent from "@/views/Student/ProfileStudent.vue";
//Admin
import AdminPage from "@/views/AdminPage.vue";
//DoExam
import DoExamPage from "@/views/DoExamPage.vue";
//Manage
import Manage from "@/views/Manage.vue";
//Pinia
import { userLogin } from "@/stores/loginDataUser.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "LoginPage",
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: "/signup",
      name: "SignUpPage",
      component: SignUpPage,
    },
    {
      path: "/professor/home",
      name: "HomePagePro",
      component: HomePagePro,
    },
    {
      path: "/professor/profile",
      name: "ProfileProfessor",
      component: ProfileProfessor,
    },
    {
      path: "/professor/create",
      name: "CreateExamPage",
      component: CreateExamPage,
    },
    {
      path: "/professor/edit/:quizId",
      name: "EditExamPage",
      component: EditExamPage,
      props: true,
    },
    {
      path: "/student/home",
      name: "HomePageStud",
      component: HomePageStud,
    },
    {
      path: "/student/profile",
      name: "ProfileStudent",
      component: ProfileStudent,
    },
    {
      path: "/exam/:examId",
      name: "DoExamPage",
      component: DoExamPage,
      props: true,
    },
    {
      path: "/admin",
      name: "AdminPage",
      component: AdminPage,
    },
    {
      path: "/manage",
      name: "Manage",
      component: Manage,
    },
  ],
});

//!Mark: การใช้ next() ในการเปลี่ยนหน้าต้องมี else{next(...)}เสมอ ไม่งั้นบึ้ม!!!!
router.beforeEach(async (to,from, next) => {
  const userLoginData = userLogin();
  const idUserData = ref("");
  //ถ้ายังไม่ได้ login จะไปหน้าอื่นไม่ได้
  if (
    (document.cookie === "") &&
    to.name !== "LoginPage" &&
    to.name !== "SignUpPage"
  ) {
    next({ name: "LoginPage" });
    //login แล้ว
  } else if(document.cookie !== ""){
    idUserData.value = await getDataById(
      `${import.meta.env.VITE_API_URL}/users`,
      document.cookie
    );
    userLoginData.keepDataFromLogin(idUserData.value);
    const isLoggedByRole = userLoginData.role;
    const allowList = {
      admin: ['AdminPage'],
      professor: ['HomePagePro', 'ProfileProfessor', 'CreateExamPage',"EditExamPage", 'DoExamPage'],
      student: ['HomePageStud', 'ProfileStudent', 'DoExamPage']
    };
    const isAllowed = allowList[isLoggedByRole]
    if (!isAllowed.includes(to.name)) {
      if (isLoggedByRole === 'admin') next({ name: 'AdminPage' });
      else if (isLoggedByRole === 'professor') next({ name: 'HomePagePro' });
      else if (isLoggedByRole === 'student') next({ name: 'HomePageStud' });
      else next(); //  ไปหน้าError
    }else{
      next(); //  ไปหน้าError
    }
  }else{
    next(); //  ไปหน้าError
  }
});

export default router;
