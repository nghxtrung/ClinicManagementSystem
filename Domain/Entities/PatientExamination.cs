using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_PatientExamination")]
    public sealed class PatientExamination : BaseEntity
    {
        [Key]
        public string Code { get; set; }
        public string PatientCode { get; set; }
        [ForeignKey("PatientCode")]
        public Patient Patient { get; set; }
        public string SpeciallistClinicCode { get; set; }
        [ForeignKey("SpeciallistClinicCode")]
        public SpeciallistClinic SpeciallistClinic { get; set; }
        public DateTime DateIn { get; set; }
        public ExaminationStatus Status { get; set; }
        public string PreliminaryDiagnosis { get; set; }
        public int? HeartBeat { get; set; }
        public int? BreathingRate { get; set; }
        public double? BloodPressure { get; set; }
        public double? Temperature { get; set; }
        public double? Weight { get; set; }
        public double? Height { get; set; }
        public string Conclude { get; set; }
        public ICollection<PatientExaminationDiagnose> PatientExaminationDiagnoses { get; set; } = new List<PatientExaminationDiagnose>();
        public ICollection<ServicePayment> ServicePayments { get; set; } = new List<ServicePayment>();
    }
}
