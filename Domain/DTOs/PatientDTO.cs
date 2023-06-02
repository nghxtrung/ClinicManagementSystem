namespace Domain.DTOs
{
    public class PatientDTO
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool Sex { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }
}
