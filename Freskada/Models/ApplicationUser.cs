using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Freskada.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            Sessions = new HashSet<Session>();
            Bookings = new HashSet<Booking>();
            Expenses = new HashSet<Expense>();
            Purchases = new HashSet<Purchase>();
        }

        [Display(Name = "Employee Name")]
        [Required]
        public string EmployeeName { get; set; }
        public virtual ICollection<Session> Sessions { get; set; }
        public virtual ICollection<Booking> Bookings { get; set; }
        public virtual ICollection<Expense> Expenses { get; set; }
        public virtual ICollection<Purchase> Purchases { get; set; }
    }
}
