namespace Domain.DTOs
{
    public class MedicineDTO
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public int Quantity { get; set; }
    }
}
