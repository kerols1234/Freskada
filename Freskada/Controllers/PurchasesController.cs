using Freskada.Data;
using Freskada.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Freskada.Controllers
{
    [Authorize]
    [EnableCors]
    public class PurchasesController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public PurchasesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        public IActionResult Upsert(int? id)
        {
            ViewBag.selectListItems = _context.Materials.Select(i => new SelectListItem
            {
                Text = i.Name,
                Value = i.Id.ToString(),
            }).ToList();

            var purchase = new Purchase();
            if (id != null)
            {
                purchase = _context.Purchases.FirstOrDefault(obj => obj.Id == id);
            }
            return View(purchase);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertAsync([FromBody]  Purchase model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    if (model.Date == null)
                    {
                        model.Date = _context.Expenses.AsNoTracking().FirstOrDefault(obj => obj.Id == model.Id).Date;
                    }
                    _context.Purchases.Update(model);
                    TempData[SD.Success] = "Purchase updated successfully";
                }
                else
                {
                    model.User = (ApplicationUser)await _userManager.GetUserAsync(User);
                    model.Date = model.Date ?? DateTime.Now;
                    _context.Purchases.Add(model);
                    TempData[SD.Success] = "Purchase created successfully";
                }
                _context.SaveChanges();
            }

            return Json(new { success = true, message = "Purchase Added successfully", href = "/Purchases/Index/" });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPurchases()
        {
            return Json(new
            {
                data = await _context.Purchases.Include(obj => obj.User).Select(obj => new
                {
                    purchase = new
                    {
                        obj.Id,
                        obj.User.EmployeeName,
                        PurchaseMaterials = obj.PurchaseMaterials.Count,
                        Date = obj.Date.GetValueOrDefault().ToString("dd/MM/yyyy hh:mm tt"),
                        Price = obj.PurchaseMaterials.Sum(s => s.Price * s.NumberOfPieces),
                    }
                }).ToListAsync()
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            var purchase = await _context.Purchases.FirstOrDefaultAsync(obj => obj.Id == id);
            if (purchase == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }
            _context.Purchases.Remove(purchase);
            _context.SaveChanges();
            return Json(new { success = true, message = "Purchase deleted successfully" });
        }
    }
}
