using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freskada.Models
{
    public class Purchase
    {
        public Purchase()
        {
            PurchaseMaterials = new HashSet<PurchaseMaterial>();
        }

        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Note { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        [MinLength(1)]
        public virtual ICollection<PurchaseMaterial> PurchaseMaterials { get; set; }
    }
}
