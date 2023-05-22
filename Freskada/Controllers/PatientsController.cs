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
    public class PatientsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult Index(int? id)
        {
            var patient = new Patient();
            if (id != null)
            {
                patient = _context.Patients.FirstOrDefault(obj => obj.Id == id);
            }
            return View(patient);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Upsert(Patient model)
        {
            if (ModelState.IsValid)
            {

                if (model.Id != 0)
                {
                    _context.Patients.Update(model);
                    TempData[SD.Success] = "Patient updated successfully";
                }
                else
                {
                    _context.Patients.Add(model);
                    TempData[SD.Success] = "Patient created successfully";
                }
                _context.SaveChanges();
            }

            /*var Descriptions = ModelState.Values.Select(obj => obj.RawValue);
            var errorMassege = string.Join(',', Descriptions);
            TempData[SD.Error] = errorMassege;*/
            return Redirect(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            return Json(new
            {
                data = await _context.Patients.Select(obj => new
                {
                    patient = new
                    {
                        obj.Id,
                        obj.Name,
                        obj.Address,
                        obj.PhoneNumber,
                        obj.HealthStatus,
                        BirthDate = obj.BirthDate.GetValueOrDefault().ToString("dd-MM-yyyy") == "01-01-0001" ? "" : obj.BirthDate.GetValueOrDefault().ToString("dd-MM-yyyy"),
                        Sessions = obj.Sessions.Count(),
                        Bookings = obj.Bookings.Count(),
                    }
                }).ToListAsync()
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(obj => obj.Id == id);
            if (patient == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }
            _context.Patients.Remove(patient);
            _context.SaveChanges();
            return Json(new { success = true, message = "Patient deleted successfully" });
        }
    }
}
