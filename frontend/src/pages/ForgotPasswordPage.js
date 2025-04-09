import ForgotPassword from "../components/ForgotPassword";
import background from "../assets/background.png";

const ForgotPasswordPage = () => {
  return (
    <div
      className="flex justify-center w-full items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;