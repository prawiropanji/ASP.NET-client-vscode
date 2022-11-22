using Microsoft.AspNetCore.Mvc;
using WebApplicationClient.Models;

namespace WebApplicationClient.Controllers
{
    public class DepartementController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Create()
        {
            return View();
        }
    }
}
