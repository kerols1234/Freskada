using Freskada.Data;
using Freskada.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Freskada.Controllers
{
    [Authorize]
    [EnableCors]
    public class ExpensesController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public ExpensesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public ActionResult Index(int? id)
        {
            var expense = new Expense();
            if (id != null)
            {
                expense = _context.Expenses.Include(obj => obj.User).FirstOrDefault(obj => obj.Id == id);
            }
            return View(expense);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertAsync(Expense model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    if (model.Date == null)
                    {
                        model.Date = _context.Expenses.AsNoTracking().FirstOrDefault(obj => obj.Id == model.Id).Date;
                    }
                    _context.Expenses.Update(model);
                    TempData[SD.Success] = "Expense updated successfully";
                }
                else
                {
                    model.User = (ApplicationUser)await _userManager.GetUserAsync(User);
                    model.Date = model.Date ?? DateTime.Now;

                    _context.Expenses.Add(model);
                    TempData[SD.Success] = "Expense created successfully";
                }
                _context.SaveChanges();
            }

            return Redirect(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllExpenses()
        {
            return Json(new
            {
                data = await _context.Expenses.Include(obj => obj.User).Select(obj => new
                {
                    expense = new
                    {
                        obj.Id,
                        obj.UserId,
                        obj.User.EmployeeName,
                        obj.Description,
                        obj.AmountOfMoney,
                        Date = obj.Date.GetValueOrDefault().ToString("dd/MM/yyyy hh:mm tt"),
                    }
                }).ToListAsync()
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(obj => obj.Id == id);
            if (expense == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }
            _context.Expenses.Remove(expense);
            _context.SaveChanges();
            return Json(new { success = true, message = "Expense deleted successfully" });
        }
    }
}
