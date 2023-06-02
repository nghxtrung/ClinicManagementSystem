using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_ServicePayment")]
    public class ServicePayment : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string PatientExaminationCode { get; set; }
        [ForeignKey("PatientExaminationCode")]
        public PatientExamination PatientExamination { get; set; }
        public Guid ServiceSubclinicalId { get; set; }
        [ForeignKey("ServiceSubclinicalId")]
        public ServiceSubclinical ServiceSubclinical { get; set; }
        public decimal? Price { get; set; }
        public ServicePaymentStatus Status { get; set; }
    }
}
