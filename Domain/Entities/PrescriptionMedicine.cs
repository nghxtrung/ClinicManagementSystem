using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_PrescriptionMedicine")]
    public class PrescriptionMedicine : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string PrescriptionCode { get; set; }
        [ForeignKey("PrescriptionCode")]
        public Prescription Prescription { get; set; }
        public Guid MedicineId { get; set; }
        [ForeignKey("MedicineId")]
        public Medicine Medicine { get; set; }
        public int Quantity { get; set; }
        public string Dosage { get; set; }
        public string Note { get; set; }
    }
}
