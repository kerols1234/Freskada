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
    public class MaterialsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MaterialsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult Index(int? id)
        {
            var material = new Material();
            if (id != null)
            {
                material = _context.Materials.FirstOrDefault(obj => obj.Id == id);
            }
            return View(material);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Upsert(Material model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    _context.Materials.Update(model);
                    TempData[SD.Success] = "Material updated successfully";
                }
                else
                {
                    _context.Materials.Add(model);
                    TempData[SD.Success] = "Material created successfully";
                }
                _context.SaveChanges();
            }

            return Redirect(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMaterials()
        {
            return Json(new
            {
                data = await _context.Materials.Select(obj => new
                {
                    material = new
                    {
                        obj.Id,
                        obj.Name,
                        obj.Price,
                        obj.Description,
                        SessionMaterials = obj.SessionMaterials.Count,
                        PurchaseMaterials = obj.PurchaseMaterials.Count,
                        Quantity = obj.PurchaseMaterials.Sum(s => s.NumberOfPieces) - obj.SessionMaterials.Sum(s => s.NumberOfPieces),
                    }
                }).ToListAsync()
            });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMaterial(int id)
        {
            var material = await _context.Materials.FirstOrDefaultAsync(obj => obj.Id == id);
            if (material == null)
            {
                return Json(new { success = false, message = "Error while deleting" });
            }
            _context.Materials.Remove(material);
            _context.SaveChanges();
            return Json(new { success = true, message = "Material deleted successfully" });
        }
    }
}
