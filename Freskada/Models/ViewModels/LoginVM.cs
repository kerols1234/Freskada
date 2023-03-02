using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Freskada.Models.ViewModels
{
    public class LoginVM
    {
        [Required]
        [Display(Name = "User Name")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
