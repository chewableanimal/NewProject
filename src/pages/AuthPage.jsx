import AuthForm from "../components/UserAuthForm"

function AuthPage(props) {
  return (
    <AuthForm register={props.register} />
  )
}

export default AuthPage