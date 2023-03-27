using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freskada.Models
{
    public class Expense
    {
        public int Id { get; set; }
        [Required]
        [DisplayName("Money")]
        public double AmountOfMoney { get; set; }
        public DateTime? Date { get; set; }
        [Required]
        public string Description { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}
