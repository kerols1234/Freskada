using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Freskada.Models
{
    public class Patient
    {
        public Patient()
        {
            Sessions = new HashSet<Session>();
            Bookings = new HashSet<Booking>();
        }

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [DataType(DataType.Date)]
        public DateTime? BirthDate { get; set; }
        [Display(Name = "Phone Number")]
        [StringLength(11, ErrorMessage = "The must be at least 11 characters long.", MinimumLength = 11)]
        [Phone]
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string HealthStatus { get; set; }
        public virtual ICollection<Session> Sessions { get; set; }
        public virtual ICollection<Booking> Bookings { get; set; }
    }
}
