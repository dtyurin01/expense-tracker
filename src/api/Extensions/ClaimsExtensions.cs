using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace Api.Extensions
{
    public static class ClaimsExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(idStr, out var id))
            {
                return id;
            }

            throw new UnauthorizedAccessException("Invalid user ID claim.");
        }
    }
}
