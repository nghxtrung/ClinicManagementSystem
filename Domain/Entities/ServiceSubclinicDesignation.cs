using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_ServiceSubclinicDesignation")]
    public class ServiceSubclinicDesignation : BaseEntity
    {
        [Key]
        public string Code { get; set; }
        public string PatientExaminationCode { get; set; }
        [ForeignKey("PatientExaminationCode")]
        public PatientExamination PatientExamination { get; set; }
        public Guid ServiceSubclinicalId { get; set; }
        [ForeignKey("ServiceSubclinicalId")]
        public ServiceSubclinical ServiceSubclinical { get; set; }
        public byte[] ImageResult { get; set; }
        public string Result { get; set; }
        public string Conclude { get; set; }
        public ExaminationStatus Status { get; set; }
    }
}
