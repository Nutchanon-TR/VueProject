# PROJECT2-SEC-2-AreLaiKorDai
## Member
| รหัสนักศึกษา | ชื่อ | หน้าที่ |
|--------------|------------------------|-------------------|
| 66130500095 | นายชิษณุพงศ์ โฉมทอง | - Profile component and edit profile : แสดงข้อมูลของ user และสามารถแก้ไขชื่อ รูป bio <br> - history conponent แสดง Created Exams history สำหรับ user ที่เป็น professor && Exam History สำหรับ user ที่เป็น professor student<br> - delete exam สำหรับ user professor <br> -popup start exam แสดงรายละเอียดข้อสอบที่ user เลือกทำและถามยืนยันที่จะเริ่มทำข้อสอบ
| 66130500115 | นายณัฐชนน เจริญเสริมสิริ | - หน้า Login -> ตรวจสอบ Email ว่ากรอกผิดมั้ยหรือมีข้อมูลใน JSON มั้ย และตรวจรหัสผ่านว่าถูกมั้ย && เก็บข้อมูล user ที่ login เข้ามาลง cookie และผูก cookie กับ pinia ผ่าน id <br> - หน้า Signin -> ตรวจสอบว่า Email นี้เคยสมัครไว้แล้วยัง ตรวจสอบว่ามี @mail มั้ย หรือลืมกรอกอะไรมั้ย  <br> - Component Nav Bar -> ดึงข้อมูลชื่อ user ที่ login จาก pinia <br> - หน้า Admin -> สำหรับ Delete/Edit Professor <br> - หน้า Home <br> Navigate Guard -> ดักการเข้าถึง role และ หน้า register <br> - Like featrue -> กดไลค์แล้วไม่สามารถกดเพิ่มได้ <br> - ดัก frontend <br> - Logout -> ลบ id ออกจาก cookie   |
| 66130500116 | นายธนกร โพธิ์ทรัพย์สุข | - หน้า CreateExamPage และ EditExamPage ที่เอาไว้แสดง component ที่ชื่อว่า ExamForm <br> - component ทั้งหมด 4 components <br> - OptionItem -> แสดง choices ของข้อสอบแต่ละข้อ  handle เรื่อง การเปลี่ยนรูปแบบ choice(checbox หรือ radio) <br> - QuestionItem -> แสดงคำถามโดยจะเป็น parent ของ OptionItem จะมีการ loop choices ของข้อนั้นๆ และมีการ handle เรื่องการ update chocie ตอนที่มีการแก้ไขตัวเลือกที่ถูก(ตัวเลือกที่เป็น true) <br> - DescriptionItem -> จะเป็นส่วนของ Description การเลือก category และการตั้งชื่อข้อสอบ <br> - ExamForm -> จะ handle event ทั้งหมดที่ถูกส่งมา เป็น parent ของ QuestionItem และ DescriptionItem ฟังก์ชั่น api หลักๆก็จะมีการดึงข้อมูลในกรณีที่ ExamForm อยู่ในโหมด Edit มีฟังก์ชั่นที่จะ handle ว่าถ้าเป็นโหมด Create ตอนกดสร้างข้อสอบก็จะเป็น POST ถ้า Edit ตอนกด Confirm ว่าจะ edit ก็เป็น PATCH   |
| 66130500117 | นายปิยโชค มีวิเวิเศษ |  - Component แบบทดสอบ เช็คว่าถูกกี่ข้อ<br> - เก็บเป็น Score (ข้อที่เป็น Multiple Choice ได้ 1 คะแนน ต้องตอบถูกทุกข้อ)<br> - ทำหน้าเฉลยข้อสอบ โดนจะบอกข้อที่เราเลือก และ บอกว่าคำตอบที่ถูกคือข้อไหน<br> - restart exam เริ่มทำข้อสอบใหม่<br> - ตรวจสอบว่ามีการเลือคำตอบไปยัง ถ้าเป็น Single chose ถ้ากดตัวไหนเปลี่ยนเป็นคำตอบตัวนั้น ถ้าเป็น multiple chose ให้กดคำตอบได้เท่ากับจำนวน true ที่มีอยู่  |


# TesT2Hub

![Screenshot 2025-04-09 013707](https://github.com/user-attachments/assets/6b07de8b-942b-4eba-a16c-4b56b5b28cf4)


## Description
เว็บไซต์นี้เป็นแพลตฟอร์มสำหรับการสร้างและทำข้อสอบออนไลน์ โดยรองรับทั้งนักเรียนและอาจารย์ สามารถใช้ในการสร้าง จัดการ และตรวจสอบข้อสอบได้อย่างมีประสิทธิภาพ นักเรียนสามารถเข้าสอบ ดูผลคะแนน และศึกษาเฉลยได้ ขณะที่อาจารย์สามารถสร้างข้อสอบ ตรวจสอบผลสอบ และจัดการสิทธิ์ของผู้ใช้ได้ และมี admin คอยจัดการเรื่องการให้สิทธิ์

## ฟีเจอร์หลัก
### ระบบบัญชีผู้ใช้
- ลงทะเบียน (Sign Up)
- เข้าสู่ระบบ (Log In)
- กำหนดบทบาท (Student / Professor / Admin)
- โปรไฟล์ผู้ใช้ (แก้ไขโปรไฟล์ได้)
- ประวัติการทำข้อสอบ และคะแนน

### การจัดการข้อสอบ
- สร้างข้อสอบ
- แก้ไข / ลบข้อสอบ
- แสดงชื่อผู้สร้างข้อสอบ
- ดูเฉลยหลังสอบเสร็จ

### การทำข้อสอบ
- นักเรียนสามารถทำข้อสอบและส่งคำตอบได้
- ระบบตรวจคำตอบอัตโนมัติ
- คำนวณคะแนน (Min, Max, Avg)
- แสดงสรุปผลคะแนน

### ระบบค้นหาและกรองข้อมูล
- ค้นหาข้อสอบ
- กรองข้อสอบตามหมวดหมู่

### ระบบจัดการสิทธิ์
- อนุมัติ / ยกเลิกบทบาท Professor
- จัดการสิทธิ์ผู้ใช้โดย Admin

### UI Design
- ธีมหลักของเว็บเป็น Minimal (White, Black, Blue)
- มีการออกแบบ Navbar, หน้าสรุปคะแนน และหน้าเริ่มต้นสอบ



# How to use? (รายละเอียดเพิ่มเติมอยู่ในลิงก์ด้านล่าง)

### Link: https://www.canva.com/design/DAGkENX3O3k/1Ax2roYB1vxQuj5g-OVm6A/edit?utm_content=DAGkENX3O3k&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton


## Login / Signup
- ลงทะเบียนผู้ใช้ (Signup) และเข้าสู่ระบบ (Login) แบบปกติ


## ระบบ Role (แบ่งออกเป็น 3 ประเภท)

### 1. Admin
- กด **Give Privilege** เพื่อเปลี่ยน role ของผู้ใช้ (เช่น เปลี่ยนเป็น Professor หรือ Student)
- ลบผู้ใช้ (**Delete User**)

### 2. Professor
- กด **Create** เพื่อสร้างข้อสอบใหม่
- กด **ชื่อผู้ใช้** ตรง **Nav Bar** → **Profile** เพื่อแก้ไขข้อมูลส่วนตัว
- กดที่ **ชื่อข้อสอบ** เพื่อ **Edit** ข้อสอบ
- กด **ถังขยะ (🗑️)** เพื่อลบข้อสอบ
- **สามารถทำทุกอย่างเหมือน Student ได้** เช่น:
  - ทำข้อสอบ
  - แก้ไขโปรไฟล์
  - ดูประวัติการทำข้อสอบ
  - ไลค์ข้อสอบ

### 3. Student
- กดที่ **ข้อสอบหน้า Home** เพื่อเริ่มทำข้อสอบ
- เข้า **หน้า Profile** → กด **Edit Profile** เพื่อแก้ไข:
  - ชื่อ (Name)
  - Bio
  - รูปโปรไฟล์ (Profile Image)
- ดู **ประวัติการทำข้อสอบ**
- กด **ไลค์ข้อสอบ** ที่ชื่นชอบ


## Logout
- กด **ชื่อผู้ใช้** ตรง **Nav Bar** → แล้วกด **Logout** เพื่อออกจากระบบ



# Design
https://www.canva.com/design/DAGg3-m6WtU/0pYba9n7QDymJ7Y71w_vOQ/edit?utm_content=DAGg3-m6WtU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

# Video explain_project
https://mailkmuttacth-my.sharepoint.com/:v:/g/personal/chitsanupong_chom_kmutt_ac_th/EXI0MUKnbEZJnGgkoAaYqIMBeL_hJuMvSjFFiMCIaFKLdA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=AVmXe6

# reference
- https://testimate.app/
- https://app.leb2.org/class
- https://github.com/

## ตารางงานของสมาชิกแต่ละสัปดาห์

| งานแต่ละสัปดาห์ / สมาชิก | 66130500095(23%) | 66130500115(29%) | 66130500116(25%) | 66130500117(23%) |
|----------------|------------|------------|------------|------------|
| **Week 1**    | หา inspiration คิดว่าจะทำ project อะไรดี| คิดหัวข้อทำโปรเจค & fegureหลักโปรเจค          | ช่วยคิดหัวข้อในการทำโปรเจค          | คุยหัวข้อโปรเจค           |
| **Week 2**    | UI design && add template readme| UI design & JSON design & คุย scope งาน          | Discuss And Help Design The UI          |ออกแบบUI คุย scope งาน         |
| **Week 3**    | ทำส่วน profile user && update profile         | -. สร้างไฟล์JSONที่disignไว้และใส่ข้อมูลuserลงไป <br> -. design path routing <br> -. ทำระบบ login(get&post), signin(get&post), HomePage(get) และ fetchAPI <br> -. สร้างระบบเก็บข้อมูล login user ลง cookie และผูกกับ pinia เพื่อเรียกใช้ <br> -. navBar(getข้อมูลชื่อuserที่loginจากpinia)            | ทำฟีเจอร์ในการสร้าง/แก้ไข/ลบ ข้อสอบ(ยังไม่สมบูรณ์)         | ทำฟีดเจอร์เช็คคำตอบ กับคะแนน (ยังไม่สมบูรณ์)           |
| **Week 4**    | profile component && function exams history by id          | ทำ Admin-page & แต่ง UI          | ปรับปรุง ฟีเจอร์ในการสร้างข้อสอบ(สมบูรณ์)         | แก้ไข ฟีเจอร์ตรวข้อสอบ เพิ่มการตรวจ้อสอบแบบ multiple choice          |
| **Week 5**    | delete exams && history components && show Profile picture          | -          | เพิ่ม ฟีเจอร์ในการ Edit ข้อสอบ      | update doexam เชื่อม json addฟังก์ชันเก็บ score          |

