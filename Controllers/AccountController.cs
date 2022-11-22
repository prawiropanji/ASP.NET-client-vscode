using Microsoft.AspNetCore.Mvc;

namespace WebApplicationClient.Controllers
{
    public class AccountController : Controller
    {

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Register()
        {


            return View();
        }


        [ActionName("Change_Password")]
        public IActionResult ChangePassword()
        {
            //string email = HttpContext.Session.GetString("Email");
            //var data = _myContext.Employees.Where(e => e.Email == email).SingleOrDefault();
            return View("ChangePassword");
        }


        public IActionResult ForgotPassword()
        {
            return View();
        }


    }
}
