using Domain.Enums;

namespace Domain.DTOs
{
    public class PatientExaminationDTO
    {
        public string Code { get; set; }
        public string PatientCode { get; set; }
        public string SpeciallistClinicCode { get; set; }
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
    }
}
