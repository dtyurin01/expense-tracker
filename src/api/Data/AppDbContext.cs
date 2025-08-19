    using Api.Models;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    namespace Api.Data;

    public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Expense> Expenses => Set<Expense>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                entity.SetTableName(ToSnakeCase(entity.GetTableName()!));

                foreach (var property in entity.GetProperties())
                    property.SetColumnName(ToSnakeCase(property.GetColumnBaseName()));

                foreach (var fk in entity.GetForeignKeys())
                    fk.SetConstraintName(ToSnakeCase(fk.GetConstraintName()!));
                foreach (var index in entity.GetIndexes())
                    index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName()!));
                var pk = entity.FindPrimaryKey();
                if (pk is not null)
                    pk.SetName(ToSnakeCase(pk.GetName()!));
            }

            builder.Entity<Category>()
                .HasIndex(x => new { x.UserId, x.Name })
                .IsUnique();

            builder.Entity<Expense>()
                .Property(x => x.Amount)
                .HasPrecision(14, 2);

            builder.Entity<Expense>()
                .HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Expense>()
                .HasOne(e => e.Category)
                .WithMany(c => c.Expenses)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RefreshToken>(e =>
            {
                e.HasIndex(x => x.TokenHash).IsUnique();
                e.HasIndex(x => x.UserId);
                e.HasIndex(x => x.Family);
            });
        }

        static string ToSnakeCase(string name)
        {
            if (string.IsNullOrEmpty(name)) return name;
            var sb = new System.Text.StringBuilder();
            for (int i = 0; i < name.Length; i++)
            {
                var c = name[i];
                if (char.IsUpper(c))
                {
                    if (i > 0 && name[i - 1] != '_' &&
                        (char.IsLower(name[i - 1]) || (i + 1 < name.Length && char.IsLower(name[i + 1]))))
                        sb.Append('_');
                    sb.Append(char.ToLowerInvariant(c));
                }
                else sb.Append(c);
            }
            return sb.ToString();
        }


    }


