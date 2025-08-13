namespace Api.Models;

public class Category
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = default!;
    public string Name { get; set; } = default!;
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();

}