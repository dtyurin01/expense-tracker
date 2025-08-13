namespace Api.Models;

public class Expense
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = default!;

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = default!;

    public decimal Amount { get; set; }          // numeric(14,2)
    public DateTime OccurredAt { get; set; }     // timestamp
    public string? Note { get; set; }
}