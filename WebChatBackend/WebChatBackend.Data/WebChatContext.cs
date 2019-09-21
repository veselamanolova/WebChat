using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Data
{
   
    public class WebChatContext : IdentityDbContext<User>
    {
        public WebChatContext(DbContextOptions<WebChatContext> options)
            : base(options)
        {
        }

        public DbSet<Group> Groups { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserGroup>()
                .HasKey(ug => new {ug.UserId, ug.GroupId});

            modelBuilder.Entity<UserGroup>()
                .HasOne(ug => ug.User)
                .WithMany(u => u.UserGroups)
                .HasForeignKey(ug => ug.UserId);

            modelBuilder.Entity<UserGroup>()
                .HasOne(ug => ug.Group)
                .WithMany(u => u.UserGroups)
                .HasForeignKey(ug => ug.GroupId);
        }
    }
}
