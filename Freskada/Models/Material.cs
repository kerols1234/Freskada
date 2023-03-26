using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Freskada.Models
{
    public class Material
    {
        public Material()
        {
            SessionMaterials = new HashSet<SessionMaterial>();
            PurchaseMaterials = new HashSet<PurchaseMaterial>();
        }

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public double Price { get; set; }
        public string Description { get; set; }
        public virtual ICollection<SessionMaterial> SessionMaterials { get; set; }
        public virtual ICollection<PurchaseMaterial> PurchaseMaterials { get; set; }
    }
}
