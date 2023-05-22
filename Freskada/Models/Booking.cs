using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freskada.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Note { get; set; }
        public int DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }
        public virtual Session Session { get; set; } = null;
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}
