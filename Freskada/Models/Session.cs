using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freskada.Models
{
    public class Session
    {
        public Session()
        {
            SessionMaterials = new HashSet<SessionMaterial>();
        }

        public int Id { get; set; }
        public DateTime? Date { get; set; }
        [Required]
        public double Price { get; set; }
        public string Note { get; set; }
        public int DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        public virtual ICollection<SessionMaterial> SessionMaterials { get; set; }
    }
}
