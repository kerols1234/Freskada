using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freskada.Models
{
    public class Expense
    {
        public int Id { get; set; }
        [Required]
        public double AmountOfMoney { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        [Required]
        public string Description { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}
