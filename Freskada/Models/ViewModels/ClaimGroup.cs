using System.Collections.Generic;
using System.Security.Claims;

namespace Freskada.Models.ViewModels
{
    public class ClaimGroup
    {
        public string GroupName { get; set; }
        public List<Claim> Claims { get; set; }
    }
}
