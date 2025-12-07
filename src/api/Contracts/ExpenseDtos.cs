using System.ComponentModel.DataAnnotations;

namespace Api.Contracts;

public record ExpenseDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    decimal Amount,
    string? Note,
    DateTime OccurredAt
);

public class CreateExpenseDto
{
    [Required]
    public Guid CategoryId { get; set; }

    [Range(0.01, 1_000_000)]
    public decimal Amount { get; set; }

    [StringLength(300)]
    public string? Note { get; set; }

    [Required]
    public DateTime OccurredAt { get; set; }
}

public class UpdateExpenseDto : CreateExpenseDto { }
