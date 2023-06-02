using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context
{
    public class EFContext : DbContext
    {
        public EFContext(DbContextOptions<EFContext> options) : base(options) { }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientExamination> PatientExaminations { get; set; }
        public DbSet<SpeciallistClinic> SpeciallistClinics { get; set; }
        public DbSet<ServiceSubclinical> ServiceSubclinicals { get; set; }
        public DbSet<Diagnose> Diagnoses { get; set; }
        public DbSet<PatientExaminationDiagnose> PatientExaminationDiagnoses { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionMedicine> PrescriptionMedicines { get; set; }
        public DbSet<ServicePayment> ServicePayments { get; set; }
        public DbSet<ServiceSubclinicDesignation> ServiceSubclinicDesignations { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PatientExamination>().Navigation(x => x.Patient).AutoInclude();
            modelBuilder.Entity<PatientExamination>().Navigation(x => x.SpeciallistClinic).AutoInclude();
            modelBuilder.Entity<PatientExamination>().Navigation(x => x.ServicePayments).AutoInclude();
            modelBuilder.Entity<PatientExamination>().Navigation(x => x.PatientExaminationDiagnoses).AutoInclude();

            modelBuilder.Entity<PrescriptionMedicine>().Navigation(x => x.Prescription).AutoInclude();
            modelBuilder.Entity<PrescriptionMedicine>().Navigation(x => x.Medicine).AutoInclude();

            modelBuilder.Entity<Prescription>().Navigation(x => x.PatientExamination).AutoInclude();
            modelBuilder.Entity<Prescription>().Navigation(x => x.PrescriptionMedicines).AutoInclude();

            modelBuilder.Entity<ServiceSubclinicDesignation>().Navigation(x => x.PatientExamination).AutoInclude();
            modelBuilder.Entity<ServiceSubclinicDesignation>().Navigation(x => x.ServiceSubclinical).AutoInclude();

            modelBuilder.Entity<ServicePayment>().Navigation(x => x.PatientExamination).AutoInclude();
            modelBuilder.Entity<ServicePayment>().Navigation(x => x.ServiceSubclinical).AutoInclude();
        }
    }
}
