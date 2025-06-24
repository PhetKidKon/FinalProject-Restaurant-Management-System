const LoginForm = ()=> {
    return (
        <div>
            <form>
                <div className="form-control">
                    <label>Email</label>
                    <input type="email" placeholder="ระบุ Email ของผู้ใช้งานระบบ" />
                </div>
                <div className="form-control">
                    <label>Password</label>
                    <input type="" placeholder="ระบุรหัสของผู้ใช้งานระบบ"/>
                </div>
                <div>
                    <button type="submit">เข้าสู่ระบบ</button>
                </div>
            </form>
        </div>
    )
}