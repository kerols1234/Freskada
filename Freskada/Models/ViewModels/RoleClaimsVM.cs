using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Freskada.Models.ViewModels
{
    public class RoleClaimsVM
    {
        public RoleClaimsVM()
        {
            Groups = new List<RoleClaimGroup>();
        }
        [Required]
        [Display(Name = "Role")]
        public string RoleName { get; set; }
        public string RoleId { get; set; }
        public List<RoleClaimGroup> Groups { get; set; }
    }
    public class RoleClaimGroup
    {
        public RoleClaimGroup()
        {
            Claims = new List<RoleClaim>();
        }
        public string GroupName { get; set; }
        public List<RoleClaim> Claims { get; set; }
    }
    public class RoleClaim
    {
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
        public bool IsSelected { get; set; }
    }
}
