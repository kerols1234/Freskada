using Freskada.Data;
using Freskada.Models;
using Freskada.Models.ViewModels;
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
    public class SessionsController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public SessionsController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
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
            var session = new Session();
            if (id != null)
            {
                session = _context.Sessions.Include(obj => obj.SessionMaterials).ThenInclude(obj => obj.Material).FirstOrDefault(obj => obj.Id == id);
            }

            ViewBag.selectListItemsOfDoctors = _context.Doctors.Select(i => new SelectListItem
            {
                Text = i.Name,
                Value = i.Id.ToString(),
            }).OrderBy(obj => obj.Text).ToList();

            ViewBag.selectListItemsOfPatients = _context.Patients.Select(i => new SelectListItem
            {
                Text = i.Name,
                Value = i.Id.ToString(),
            }).OrderBy(obj => obj.Text).ToList();

            ViewBag.selectListItemsOfMaterials = _context.Materials.AsEnumerable().Except(session.SessionMaterials.Select(obj => obj.Material)).Select(i => new SelectListItem
            {
                Text = i.Name,
                Value = i.Id.ToString(),
            }).OrderBy(obj => obj.Text).ToList();

            return View(session);
        }

        [HttpPost]
        public async Task<IActionResult> LoadBookingsAsync([FromBody] LoadingBookingsVM model)
        {
            return Json(await _context.Bookings
                                .Include(obj => obj.Session)
                                .Where(obj => (obj.DoctorId == model.DoctorId
                                                && obj.PatientId == model.PatientId
                                                && obj.Session == null)
                                            || obj.Session.Id == model.SessionId)
                                .OrderByDescending(obj => obj.Session)
                                .ThenByDescending(obj => obj.Date)
                                .Select(obj => new
                                {

                                    Text = obj.Date.GetValueOrDefault().ToString("dd/MM/yyyy hh:mm tt"),
                                    Value = obj.Id.ToString(),
                                }).ToListAsync()
            );
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertAsync([FromBody] Session model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (model.Id != 0)
                    {
                        var sessionMaterials = _context.SessionMaterials.Where(obj => obj.SessionId == model.Id);

                        _context.Entry(model).State = EntityState.Modified;

                        foreach (var item in model.SessionMaterials)
                        {
                            if (item.SessionId > 0)
                            {
                                _context.Entry(item).State = EntityState.Modified;
                            }
                            else if (item.SessionId < 0)
                            {
                                item.SessionId = model.Id;
                                _context.Entry(item).State = EntityState.Deleted;
                            }
                            else
                            {
                                _context.Entry(item).State = EntityState.Added;
                            }
                        }
                        TempData[SD.Success] = "Session updated successfully";
                    }
                    else
                    {
                        model.User = (ApplicationUser)await _userManager.GetUserAsync(User);
                        model.Date = model.Date ?? DateTime.Now;
                        _context.Sessions.Add(model);
                        TempData[SD.Success] = "Session created successfully";
                    }
                    _context.SaveChanges();
                }
                catch (Exception)
                {
                    TempData.Clear();
                    TempData[SD.Error] = "Something wrong happend";
                }
            }
            return Json(new { success = true, href = "/Sessions/Index/" });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSessions()
        {
            return Json(new
            {
                data = await _context.Sessions.Include(obj => obj.SessionMaterials).Select(obj => new
                {
                    session = new
                    {
                        obj.Id,
                        DoctorName = obj.Doctor.Name,
                        PatientName = obj.Patient.Name,
                        IsBooked = obj.BookingId == null ? false : true,
                        obj.Price,
                        SessionMaterials = obj.SessionMaterials.Sum(m => m.NumberOfPieces),
                        Date = obj.Date.GetValueOrDefault().ToString("dd/MM/yyyy hh:mm tt"),
                    }
                }).ToListAsync()
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.Sessions.FirstOrDefaultAsync(obj => obj.Id == id);
            if (session == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }
            _context.Sessions.Remove(session);
            _context.SaveChanges();
            return Json(new { success = true, message = "Session deleted successfully" });
        }
    }
}
