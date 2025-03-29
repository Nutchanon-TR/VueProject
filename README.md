# PROJECT2-SEC-2-AreLaiKorDai
## Member
| รหัสนักศึกษา | ชื่อ | หน้าที่ |
|--------------|------------------------|-------------------|
| 66130500095 | นายชิษณุพงศ์ โฉมทอง | - หน้า Score Student<br> - หน้า Score Teacher<br> - หน้า Start Exam|
| 66130500115 | นายณัฐชนน เจริญเสริมสิริ | - หน้า Login -> ตรวจสอบ Email ว่ากรอกผิดมั้ยหรือมีข้อมูลใน JSON มั้ย และตรวจรหัสผ่านว่าถูกมั้ย && เก็บข้อมูล user ที่ login เข้ามาลง cookie และผูก cookie กับ pinia ผ่าน id <br> - หน้า Signin -> ตรวจสอบว่า Email นี้เคยสมัครไว้แล้วยัง ตรวจสอบว่ามี @mail มั้ย หรือลืมกรอกอะไรมั้ย  <br> - Component Nav Bar -> ดึงข้อมูลชื่อ user ที่ login จาก pinia <br> - หน้า Admin -> สำหรับ Delete/Edit Professor <br> - หน้า Home   |
| 66130500116 | นายธนกร โพธิ์ทรัพย์สุข | - Component Create<br> - Component Edit |
| 66130500117 | นายปิยโชค มีวิเวิเศษ |  - Component แบบทดสอบ เช็คว่าถูกกี่ข้อ<br> - เก็บเป็น Score (ข้อที่เป็น Multiple Choice ได้ 1 คะแนน ต้องตอบถูกทุกข้อ) |


# TesT2Hub

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


# Design
https://www.canva.com/design/DAGg3-m6WtU/0pYba9n7QDymJ7Y71w_vOQ/edit?utm_content=DAGg3-m6WtU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

# reference
- https://testimate.app/
- https://app.leb2.org/class
- https://github.com/

## ตารางงานของสมาชิกแต่ละสัปดาห์

| งานแต่ละสัปดาห์ / สมาชิก | 66130500095 | 66130500115 | 66130500116 | 66130500117 |
|----------------|------------|------------|------------|------------|
| **Week 1**    | หา inspiration คิดว่าจะทำ project อะไรดี| คิดหัวข้อทำโปรเจค & fegureหลักโปรเจค          | ช่วยคิดหัวข้อในการทำโปรเจค          | คุยหัวข้อโปรเจค           |
| **Week 2**    | UI design && add template readme| UI design & JSON design & คุย scope งาน          | Discuss And Help Design The UI          |ออกแบบUI คุย scope งาน         |
| **Week 3**    | ทำส่วน profile user && update profile         | -. สร้างไฟล์JSONที่disignไว้และใส่ข้อมูลuserลงไป <br> -. design path routing <br> -. ทำระบบ login(get&post), signin(get&post), HomePage(get) และ fetchAPI <br> -. สร้างระบบเก็บข้อมูล login user ลง cookie และผูกกับ pinia เพื่อเรียกใช้ <br> -. navBar(getข้อมูลชื่อuserที่loginจากpinia)            | ทำฟีเจอร์ในการสร้าง/แก้ไข/ลบ ข้อสอบ(ยังไม่สมบูรณ์)         | ทำฟีดเจอร์เช็คคำตอบ กับคะแนน (ยังไม่สมบูรณ์)           |
| **Week 4**    | profile component && function exams history by id          | ทำ Admin-page & แต่ง UI          | ปรับปรุง ฟีเจอร์ในการสร้างข้อสอบ(สมบูรณ์)         | แก้ไข ฟีเจอร์ตรวข้อสอบ เพิ่มการตรวจ้อสอบแบบ multiple choice          |
| **Week 5**    | delete exams && history components && show Profile picture          | -          | เพิ่ม ฟีเจอร์ในการ Edit ข้อสอบ (ยังไม่เสร็จสมบูรณ์)      | update doexam เชื่อม json addฟังก์ชันเก็บ score          |

