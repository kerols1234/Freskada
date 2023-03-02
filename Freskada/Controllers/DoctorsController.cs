using Freskada.Data;
using Freskada.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Freskada.Controllers
{
    [Authorize]
    [EnableCors]
    public class DoctorsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult Index(int? id)
        {
            var doctor = new Doctor();
            if (id != null)
            {
                doctor = _context.Doctors.FirstOrDefault(obj => obj.Id == id);
            }
            return View(doctor);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Upsert(Doctor model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    _context.Doctors.Update(model);
                    TempData[SD.Success] = "Doctor updated successfully";
                }
                else
                {
                    _context.Doctors.Add(model);
                    TempData[SD.Success] = "Doctor created successfully";
                }
                _context.SaveChanges();
            }

            /*var Descriptions = ModelState.Values.Select(obj => obj.RawValue);
            var errorMassege = string.Join(',', Descriptions);
            TempData[SD.Error] = errorMassege;*/
            return Redirect(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            return Json(new
            {
                data = await _context.Doctors.Select(obj => new
                {
                    doctor = new
                    {
                        obj.Id,
                        obj.Name,
                        obj.Address,
                        obj.PhoneNumber,
                        obj.Specialty,
                        BirthDate = obj.BirthDate.GetValueOrDefault().ToString("dd-MM-yyyy") == "01-01-0001" ? "" : obj.BirthDate.GetValueOrDefault().ToString("dd-MM-yyyy"),
                        Sessions = obj.Sessions.Count(),
                        Bookings = obj.Bookings.Count(),
                    }
                }).ToListAsync()
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(obj => obj.Id == id);
            if (doctor == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }
            _context.Doctors.Remove(doctor);
            _context.SaveChanges();
            return Json(new { success = true, message = "Doctor deleted successfully" });
        }
    }
}
