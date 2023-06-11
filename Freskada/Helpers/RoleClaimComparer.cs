using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Freskada.Helpers
{
    public class RoleClaimComparer : IEqualityComparer<IdentityRoleClaim<string>>
    {
        public bool Equals(IdentityRoleClaim<string> x, IdentityRoleClaim<string> y)
        {
            if (x.ClaimValue == y.ClaimValue && x.ClaimType == y.ClaimType)
                return true;

            return false;
        }

        public int GetHashCode(IdentityRoleClaim<string> obj)
        {
            return (obj.RoleId, obj.ClaimType, obj.ClaimValue).GetHashCode();
        }
    }
}
