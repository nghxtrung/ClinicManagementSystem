using Domain.Enums;

namespace Domain.DTOs
{
    public class ServicePaymentDTO
    {
        public Guid? Id { get; set; }
        public string PatientExaminationCode { get; set; }
        public Guid ServiceSubclinicalId { get; set; }
        public decimal? Price { get; set; }
        public ServicePaymentStatus Status { get; set; }
    }
}
