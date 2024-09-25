# Authentication & Authorization (JWT)

## Validation
- **Input Validation**: 
  - ตรวจสอบการกรอกข้อมูล `email` และ `password` ในฟอร์มลงทะเบียนและเข้าสู่ระบบ (`register`, `login` routes).
  - หากข้อมูลขาดไป จะแจ้งเตือนด้วยข้อความเช่น `"Email is required"` หรือ `"Password is required"`.
  
- **User Validation**: 
  - ตรวจสอบว่า `email` ที่ลงทะเบียนมีอยู่แล้วในฐานข้อมูลหรือไม่ก่อนสร้างผู้ใช้ใหม่.
  - ในขั้นตอนการเข้าสู่ระบบ จะตรวจสอบความถูกต้องของอีเมลและรหัสผ่าน.

## Error Handling
- จัดการกรณีที่พบข้อผิดพลาดต่าง ๆ:
  - หาก `email` มีการลงทะเบียนแล้วในฟังก์ชัน `register` จะส่ง HTTP status code `400` พร้อมข้อความ `"Email is already registered"`.
  - หากการตรวจสอบรหัสผ่านล้มเหลวในฟังก์ชัน `login` จะส่ง HTTP status code `401` พร้อมข้อความ `"Invalid user credentials"`.
  - จัดการข้อผิดพลาดภายในเซิร์ฟเวอร์ด้วย HTTP status code `500` และแสดง `"Internal server error"`.

## API Versioning
- API ถูกแบ่งออกเป็นเวอร์ชัน (เช่น `/api/v1/auth`) เพื่อรองรับการขยายและปรับปรุงในอนาคต.
  
## Security
### CORS (Cross-Origin Resource Sharing)
- ใช้ `cors` middleware เพื่อควบคุมว่าแอปพลิเคชันสามารถรับคำขอจาก origin ใดได้บ้าง เพื่อป้องกันปัญหา Cross-Origin Requests ที่ไม่ปลอดภัย.

### SQL Injection Protection
- ใช้ parameterized queries ในการสืบค้นฐานข้อมูล (`SELECT`, `INSERT`) เพื่อป้องกัน SQL Injection. เช่น `connectionPool.query("SELECT * FROM users WHERE email = $1", [email])`.

### Data Encryption
- รหัสผ่านของผู้ใช้ถูกเข้ารหัสโดยใช้ `bcrypt` ก่อนที่จะบันทึกลงฐานข้อมูล (`register` route).
- การเข้ารหัสข้อมูลเพิ่มเติมเกิดขึ้นในการสร้าง JWT token (`jwt.sign`) และการตรวจสอบ JWT (`jwt.verify`) เพื่อรักษาความปลอดภัยของข้อมูลในระหว่างการส่งข้อมูล.

## Documentation (Swagger)
- ใช้ Swagger สำหรับการสร้างเอกสาร API โดยใช้ `swagger-ui-express` เพื่อแสดงผล API docs.
- สามารถเข้าถึงเอกสารได้จาก `/api-docs`, ซึ่งจะมีการอธิบาย endpoint ต่าง ๆ รวมถึงวิธีการทดสอบ API.
