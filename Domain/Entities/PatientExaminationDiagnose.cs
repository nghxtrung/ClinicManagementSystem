using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_PatientExaminationDiagnose")]
    public class PatientExaminationDiagnose : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string PatientExaminationCode { get; set; }
        [ForeignKey("PatientExaminationCode")]
        public PatientExamination PatientExamination { get; set; }
        public string DiagnoseCode { get; set; }
        [ForeignKey("DiagnoseCode")]
        public Diagnose Diagnose { get; set; }
    }
}
