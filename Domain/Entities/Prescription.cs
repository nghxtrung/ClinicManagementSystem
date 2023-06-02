using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_Prescription")]
    public class Prescription : BaseEntity
    {
        [Key]
        public string Code { get; set; }
        public string PatientExaminationCode { get; set; }
        [ForeignKey("PatientExaminationCode")]
        public PatientExamination PatientExamination { get; set; }
        public ICollection<PrescriptionMedicine> PrescriptionMedicines { get; set; } = new List<PrescriptionMedicine>();
        public string Advice { get; set; }
    }
}
