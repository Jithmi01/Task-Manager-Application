import ResetPassword from "../components/ResetPassword";
import background from "../assets/background.png";

const ResetPasswordPage = () => {
  return (
    <div
      className="flex justify-center w-full items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;