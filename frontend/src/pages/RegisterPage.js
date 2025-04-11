import RegisterForm from "../components/RegisterForm";
import background from "../assets/bg1.jpg";

const RegisterPage = () => {
  return (
    <div
      className="flex justify-center w-full items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
        <RegisterForm />
      
    </div>
  );
};

export default RegisterPage;
