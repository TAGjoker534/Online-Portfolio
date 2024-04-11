import {Avatar} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useAuth} from "../../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {useNotification} from "../../hooks/useNotification.js";

const Signup = () => {
    const paperStyle = {padding: 20, width: 400, margin: "0 auto"}
    const headerStyle = {margin: 0}
    const fieldStyle = {marginBottom: '8px'}
    const avatarStyle = {backgroundColor: '#1bbd7e'}
    const btnStyle = {margin: '8px 0'}

    const {setUsername} = useAuth()
    const navigate = useNavigate();

    const notify = useNotification()
    //FORMIK INITIAL VALUES
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    }

    //YUP
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("required"),
        lastName: Yup.string().required("required"),
        username: Yup.string().required("required"),
        email: Yup.string().email('Please enter a valid email').required("Required"),
        password: Yup.string().required("required"),
        confirmPassword: Yup.string().required("required")
    })
    const submitForm = async (values, props) => {

        console.log(values)
        const data = {
            email: values.email,
            pwd: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username
        }

        axios({
            url: "http://localhost:8080/signup/",
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            data: data
        }).then((res) => {
            const token = Cookies.get("jwt_token");

            if (token !== "" || token !== undefined) {
                localStorage.setItem("justAuthenticated", "true");
                localStorage.setItem("userId", res.data.result.user.id)
                localStorage.setItem("username", res.data.result.user.username)
                setUsername(res.data.result.user.username);
                navigate("/");
            }
        }).catch((err) => {
            if (err.response.status === 500) {
                notify("User already exists", "error")
            } else {
                notify("Unknown error", "error")
            }
        })

    }

    return (
        <Grid>
            <Paper style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineIcon/>
                    </Avatar>
                    <h2 style={headerStyle}>Sign Up</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                </Grid>
                <Formik initialValues={initialValues} validationSchema={validationSchema}
                        onSubmit={(values, props) => submitForm(values, props)}>
                    {(props) => (

                        <Form>
                            <Grid style={fieldStyle} container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        autoComplete="given-name"
                                        name="firstName"
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        helperText={<ErrorMessage name={"firstName"}/>}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        helperText={<ErrorMessage name={"lastName"}/>}

                                        //{...register('lastName')}

                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    style={fieldStyle}
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    helperText={<ErrorMessage name={"email"}/>}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    style={fieldStyle}
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    helperText={<ErrorMessage name={"username"}/>}
                                />
                            </Grid>

                            <Grid style={fieldStyle} container spacing={2}>

                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        helperText={<ErrorMessage name={"password"}/>}

                                        // {...register('password')}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm"
                                        type="password"
                                        id="confirmPassword"
                                        autoComplete="new-password"
                                        helperText={<ErrorMessage name={"password"}/>}

                                        // {...register('confirmPassword')}

                                    />
                                </Grid>
                            </Grid>
                            <Button type='submit' variant='contained' color='primary' style={btnStyle} fullWidth>
                                Sign up
                            </Button>
                        </Form>
                    )}
                </Formik>

            </Paper>
        </Grid>
    )
}

export default Signup;