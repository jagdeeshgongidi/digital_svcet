import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link,useNavigate } from "react-router-dom";
import "./App.css";
import Container from "react-bootstrap/esm/Container";
import {Row,Col} from "react-bootstrap"

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
   
    const naviGate=useNavigate()
    const emailRef = useRef();
    const errRef = useRef();


    
    const [email, setEmail] = useState("");
    const [emailFocus, setEmailFocus] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    const [className,setClassName]=useState('');
    const [classNameFocus, setclassNameFocus] = useState(false);

    const [type,setType]=useState('student')



    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        if (email){
            emailRef.current.focus();
        }
        
      }, []);
    useEffect(() => {
        if (email) {
          const result = EMAIL_REGEX.test(email);
          setValidEmail(result);
        }
      }, [email]);
    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd,email])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd,email,className:className,status:type }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }
    console.log(type)
    return (
      <div className="register">
        {success ? (
          naviGate("/login")
        ) : (
          <div className="form-conatainer" >
                  <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive">
                    {errMsg}
                  </p>
                <h1>Register</h1>
                <div className="">
                <form className="form-conatainer" onSubmit={handleSubmit}>
                
                    <label htmlFor="email">
                      Email:
                      <span className={validEmail ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      <span
                        className={validEmail || !email ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                    </label>
                    <input
                      id="regEMail"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value.toLowerCase());
                      }}
                      ref={emailRef}
                      autoComplete="off"
                      aria-invalid={validEmail ? "false" : "true"}
                      aria-describedby="uiemail"
                      required
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                    />
                    <p
                      id="uidnote"
                      className={
                        emailFocus && !validEmail ? "instructions" : "offscreen"
                      }>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      enter a valid email <br />
                      Must include @ .<br />
                    </p>
                  
                    <label htmlFor="username">
                      Username:
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validName ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={validName || !user ? "hide" : "invalid"}
                      />
                    </label>
                    <input
                      style={{width:"100%"}}
                      type="text"
                      id="regusername"
                      autoComplete="off"
                      onChange={(e) => setUser((e.target.value).toLowerCase())}
                      value={user}
                      required
                      aria-invalid={validName ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                    />
                    <p
                      id="uidnote"
                      className={
                        userFocus && user && !validName
                          ? "instructions"
                          : "offscreen"
                      }>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      4 to 24 characters.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores, hyphens allowed.
                    </p>
                
                  <label htmlFor="className">
                    ClassName:
                    {/* <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} /> */}
                  </label>

                  <input
                    style={{width:"100%",backgroundColor:'#0f91bc'}}
                    type="text"
                    id="className"
                    autoComplete="off"
                    onChange={(e) => setClassName(e.target.value)}
                    value={className}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setclassNameFocus(true)}
                    onBlur={() => setclassNameFocus(false)}
                  />

                  <p
                    id="uidnote"
                    className={classNameFocus ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 characters.
                    <br />
                    Must begin with a number.
                    <br />
                    eg: 4csec
                  </p>

                  <label htmlFor="type">Select student / Teacher </label>
                  <select
                    style={{width:"100%",height:"43px",borderRadius:'8px', backgroundColor:'#0f91bc'}}
                    onChange={(event) => setType(event.target.value)}
                    value={type}
                    required>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>

                  <label htmlFor="password">
                    Password:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validPwd ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validPwd || !pwd ? "hide" : "invalid"}
                    />
                  </label>
                  <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                  />
                  <p
                    id="pwdnote"
                    className={
                      pwdFocus && !validPwd ? "instructions" : "offscreen"
                    }>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.
                    <br />
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                    <br />
                    Allowed special characters:{" "}
                    <span aria-label="exclamation mark">!</span>{" "}
                    <span aria-label="at symbol">@</span>{" "}
                    <span aria-label="hashtag">#</span>{" "}
                    <span aria-label="dollar sign">$</span>{" "}
                    <span aria-label="percent">%</span>
                  </p>

                  <label htmlFor="confirm_pwd">
                    Confirm Password:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validMatch && matchPwd ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validMatch || !matchPwd ? "hide" : "invalid"}
                    />
                  </label>
                  <input
                    type="password"
                    id="confirm_pwd"
                    style={{backgroundColor:'#0f91bc'}}
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                  />
                  <p
                    id="confirmnote"
                    className={
                      matchFocus && !validMatch ? "instructions" : "offscreen"
                    }>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                  </p>

                  <button
                    disabled={
                      !validName || !validPwd || !validMatch ? true : false
                    }>
                    Sign Up
                  </button>
                </form>
               
                <p>
                  Already registered?
                  <br />
                  <span className="line">
                    <Link to="/">Sign In</Link>
                  </span>
                </p>
                </div>
             
      
          </div>
        )}
      </div>
    );
}

export default Register
