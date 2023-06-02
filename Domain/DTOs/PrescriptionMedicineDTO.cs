namespace Domain.DTOs
{
    public class PrescriptionMedicineDTO
    {
        public Guid? Id { get; set; }
        public string PrescriptionCode { get; set; }
        public Guid MedicineId { get; set; }
        public int Quantity { get; set; }
        public string Dosage { get; set; }
        public string Note { get; set; }
    }
}
