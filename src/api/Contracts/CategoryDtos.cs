namespace Api.Contracts;

public record CategoryDto(Guid Id, string Name);

public record CreateCategoryDto(string Name);