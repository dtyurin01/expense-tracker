using System.ComponentModel.DataAnnotations;

namespace Api.Contracts;

public record CategoryDto(Guid Id, string Name);

public class CreateCategoryDto
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;
}

public class UpdateCategoryDto
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;
}
