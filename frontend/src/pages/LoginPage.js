import LoginForm from "../components/LoginForm";
import background from "../assets/background.png";

const LoginPage = () => {
  return (
    <div
      className="flex justify-center w-full items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }} // Use the imported image correctly
    >
      <LoginForm />
    </div>
  );
};

export default LoginPage;
