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
    public class BookingsController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public ActionResult Index(int? id)
        {
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

            var booking = new Booking();
            if (id != null)
            {
                booking = _context.Bookings.FirstOrDefault(obj => obj.Id == id);
            }

            return View(booking);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertAsync(Booking model)
        {
            if (ModelState.IsValid)
            {

                if (model.Id != 0)
                {
                    if (model.Date == null)
                    {
                        model.Date = _context.Bookings.AsNoTracking().FirstOrDefault(obj => obj.Id == model.Id).Date;
                    }
                    _context.Bookings.Update(model);
                    TempData[SD.Success] = "Booking updated successfully";
                }
                else
                {
                    model.User = (ApplicationUser)await _userManager.GetUserAsync(User);
                    model.Date = model.Date ?? DateTime.Now;

                    _context.Bookings.Add(model);
                    TempData[SD.Success] = "Booking created successfully";
                }
                _context.SaveChanges();
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

            /*var Descriptions = ModelState.Values.Select(obj => obj.RawValue);
            var errorMassege = string.Join(',', Descriptions);
            TempData[SD.Error] = errorMassege;*/
            return Redirect(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            return Json(new
            {
                data = await _context.Bookings.Select(obj => new
                {
                    booking = new
                    {
                        obj.Id,
                        DoctorName = obj.Doctor.Name,
                        PatientName = obj.Patient.Name,
                        obj.Note,
                        obj.PatientId,
                        obj.DoctorId,
                        Date = obj.Date.GetValueOrDefault().ToString("dd/MM/yyyy hh:mm tt"),
                        obj.UserId,
                    }
                }).ToListAsync()
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(obj => obj.Id == id);
            if (booking == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }
            _context.Bookings.Remove(booking);
            _context.SaveChanges();
            return Json(new { success = true, message = "Booking deleted successfully" });
        }
    }
}
