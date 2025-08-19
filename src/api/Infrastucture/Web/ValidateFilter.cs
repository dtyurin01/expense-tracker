using System.ComponentModel.DataAnnotations;

namespace Api.Infrastucture.Web;

public sealed class ValidateFilter<T> : IEndpointFilter where T : class
{
    public async ValueTask<object> InvokeAsync(EndpointFilterInvocationContext ctx, EndpointFilterDelegate next)
    {
        var model = ctx.Arguments.FirstOrDefault(a => a is T) as T;
        if (model is not null)
        {
            var results = new List<ValidationResult>();
            if (!Validator.TryValidateObject(model, new ValidationContext(model), results, true))
            {
                var errors = results
                    .SelectMany(r => r.MemberNames.DefaultIfEmpty(string.Empty), (r, m) => (m, r.ErrorMessage ?? "Invalid"))
                    .GroupBy(x => x.m)
                    .ToDictionary(g => g.Key, g => g.Select(x => x.Item2).ToArray());
                return Results.ValidationProblem(errors);
            }
        }
        return await next(ctx);
    }
}

