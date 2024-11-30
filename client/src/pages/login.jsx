import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import '../styles/login.css'


const Login = () => {
    return (
        <div className="login">
            <Form className='loginForm '>
                <h2 className="text-center  mb-4" dir='rtl'>تسجيل الدخول</h2>
                <Form.Group className="mb-3" controlId="formEmail">
                    <FloatingLabel
                        dir='rtl'
                        lang="ar"
                        controlId="floatingInput"
                        label="الحساب الالكتروني"
                        className="mb-3 form-label"
                    >
                        <Form.Control type="email" placeholder="name@example.com" />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3' controlId="formPassword">
                    <FloatingLabel dir='rtl'
                        lang="ar" controlId="floatingPassword" label="الرقم السري" className="mb-3 form-label">
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3' dir='rtl' controlId="checkBoxStaySigned">
                    <Form.Check

                        type="checkbox"
                        id="autoSizingCheck"
                        className="mb-2"
                        label="تذكرني"
                    />
                </Form.Group>
                <Form.Group className="mb-3 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary w-auto " >
                        تسجيل الدخول
                    </button>
                </Form.Group>
                <Form.Group dir="rtl" className="mb-3 center">
                    <a href="/forgot-password" className="text-decoration-none">نسيت كلمة السر ؟</a>
                </Form.Group>
            </Form>
        </div>
    );
};

export default Login