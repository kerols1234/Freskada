using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Freskada.Models;

namespace Freskada.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<SessionMaterial>().HasKey(sm => new { sm.MaterialId, sm.SessionId });
            builder.Entity<PurchaseMaterial>().HasKey(pm => new { pm.MaterialId, pm.PurchaseId });
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SessionMaterial> SessionMaterials { get; set; }
        public DbSet<PurchaseMaterial> PurchaseMaterials { get; set; }
    }
}
